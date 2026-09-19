import json
import logging
import os
import asyncio
from typing import Any
import aio_pika
from aio_pika import Message, DeliveryMode

from app.db import AsyncSessionLocal
from sqlalchemy.future import select
from app.models import Feature

logger = logging.getLogger("jupiter.rabbitmq")

_RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
_connection: aio_pika.RobustConnection | None = None
_channel: aio_pika.RobustChannel | None = None

async def init_rabbitmq() -> None:
    global _connection, _channel
    try:
        _connection = await aio_pika.connect_robust(_RABBITMQ_URL)
        _channel = await _connection.channel()
        logger.info("Connected to RabbitMQ via aio-pika")
    except Exception as exc:
        logger.error(f"Failed to connect to RabbitMQ: {exc}")

async def close_rabbitmq() -> None:
    global _connection
    if _connection and not _connection.is_closed:
        await _connection.close()
        logger.info("RabbitMQ connection closed")

async def publish_job(routing_key: str, body: dict[str, Any]) -> None:
    global _channel
    if not _channel:
        logger.warning("RabbitMQ channel not initialized, dropping message")
        return
        
    try:
        message = Message(
            body=json.dumps(body).encode("utf-8"),
            delivery_mode=DeliveryMode.PERSISTENT,
            content_type="application/json"
        )
        await _channel.default_exchange.publish(
            message,
            routing_key=routing_key
        )
    except Exception as exc:
        logger.error(f"[rabbitmq] publish failed (non-fatal): {exc}")

async def process_features_result(message: aio_pika.IncomingMessage) -> None:
    async with message.process():
        try:
            payload = json.loads(message.body.decode('utf-8'))
            evaluation_id = payload.get('evaluation_id')
            tenant_id = payload.get('tenant_id')
            
            if not evaluation_id or not tenant_id:
                logger.error("Missing evaluation_id or tenant_id in features.results")
                return
                
            logger.info(f"[Fan-In] Received feature result for evaluation_id={evaluation_id}")
            
            # Check if all 3 features are ready
            async with AsyncSessionLocal() as db:
                result = await db.execute(
                    select(Feature.kind).where(Feature.evaluation_id == evaluation_id)
                )
                kinds = set(row[0] for row in result.all())
                
            required = {'pose', 'transcript', 'prosody'}
            if required.issubset(kinds):
                # All ready! Publish to scoring
                logger.info(f"[Fan-In] All features ready for evaluation_id={evaluation_id}. Triggering scoring.")
                await publish_job('scoring.jobs', {
                    'job_id': f'score-{evaluation_id}',
                    'evaluation_id': str(evaluation_id),
                    'tenant_id': str(tenant_id)
                })
            else:
                logger.info(f"[Fan-In] Waiting for other features. Current: {kinds}")
                
        except Exception as exc:
            logger.exception(f"[Fan-In] Error processing features.results: {exc}")

async def start_features_consumer() -> None:
    global _channel
    if not _channel:
        return
        
    try:
        queue = await _channel.declare_queue('features.results', durable=True)
        await queue.consume(process_features_result)
        logger.info("[Fan-In] Started consumer for features.results")
    except Exception as exc:
        logger.error(f"[Fan-In] Failed to start consumer: {exc}")

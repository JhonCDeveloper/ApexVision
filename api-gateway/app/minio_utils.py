import os
from datetime import timedelta
from minio import Minio
from urllib.parse import urlparse, urlunparse

def get_minio_client() -> Minio:
    endpoint = os.getenv("MINIO_ENDPOINT", "localhost:9000")
    access_key = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
    secret_key = os.getenv("MINIO_SECRET_KEY", "minioadmin")
    secure = os.getenv("MINIO_USE_SSL", "false").lower() == "true"
    return Minio(endpoint, access_key=access_key, secret_key=secret_key, secure=secure)

def get_minio_bucket() -> str:
    return os.getenv("MINIO_BUCKET", "jupiter-videos")

def get_minio_public_endpoint() -> str:
    return os.getenv("MINIO_PUBLIC_ENDPOINT", os.getenv("MINIO_ENDPOINT", "localhost:9000"))

def ensure_bucket() -> None:
    client = get_minio_client()
    bucket = get_minio_bucket()
    if not client.bucket_exists(bucket):
        client.make_bucket(bucket)

def presigned_upload_url(object_key: str, expires: timedelta = timedelta(minutes=15)) -> str:
    client = get_minio_client()
    url = client.presigned_put_object(get_minio_bucket(), object_key, expires=expires)
    public = get_minio_public_endpoint()
    if public:
        parsed = list(urlparse(url))
        parsed[1] = public
        url = urlunparse(parsed)
    return url

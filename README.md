<div align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
</div>

<br>

<h1 align="center">Apex Vision</h1>
<h3 align="center">AI-Powered Sales Intelligence & Coaching</h3>

<p align="center">
  <b>Elevate your sales team's performance with real-time AI coaching.</b><br>
  An advanced multi-tenant B2B platform that analyzes body language, vocal prosody, and speech structure to deliver actionable, AI-driven feedback for sales professionals.
</p>

<br>

## <img src="https://api.iconify.design/lucide:sparkles.svg?color=%23009688" width="24" align="center"> Key Features

<table>
  <tr>
    <td width="50%" valign="top">
      <h4><img src="https://api.iconify.design/lucide:focus.svg?color=%23009688" width="20" align="center"> Computer Vision</h4>
      <p>Uses <b>MediaPipe</b> to analyze posture, hand gestures, and body language during the pitch in real-time.</p>
    </td>
    <td width="50%" valign="top">
      <h4><img src="https://api.iconify.design/lucide:mic.svg?color=%23009688" width="20" align="center"> Audio Processing</h4>
      <p>Transcribes speech with high accuracy using <b>OpenAI Whisper</b> and extracts vocal prosody via <b>Librosa</b>.</p>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4><img src="https://api.iconify.design/lucide:brain-circuit.svg?color=%23009688" width="20" align="center"> Intelligent Scoring</h4>
      <p>Aggregates multimodal data and leverages LLMs (<b>GPT-4o</b> / <b>Groq</b>) to generate actionable score and coaching.</p>
    </td>
    <td width="50%" valign="top">
      <h4><img src="https://api.iconify.design/lucide:building-2.svg?color=%23009688" width="20" align="center"> Multi-Tenant B2B</h4>
      <p>Secure separation of tenant data, RBAC (Sellers vs. Admins), and organizational metrics.</p>
    </td>
  </tr>
</table>

## <img src="https://api.iconify.design/lucide:network.svg?color=%23009688" width="24" align="center"> Architecture

The system is designed with a scalable, decoupled microservices architecture via **RabbitMQ**:

- **Frontend (React):** A dynamic dashboard for both Sellers and Admins.
- **API Gateway (FastAPI):** High-performance asynchronous entry point handling authentication, WebSockets, and S3 presigned URLs.
- **AI Workers Cluster (Python):** Independent task consumers (Pose, Whisper, Prosody, Scoring) scaling independently based on queue load.
- **Data & Storage:** **PostgreSQL** for relational data and **MinIO/S3** for raw video storage.

## <img src="https://api.iconify.design/lucide:zap.svg?color=%23009688" width="24" align="center"> Quickstart

Getting the entire stack running locally is incredibly simple thanks to Docker.

```bash
# 1. Clone the repository
git clone https://github.com/JhonCDeveloper/ApexVision.git
cd ApexVision

# 2. Configure Environment
cp .env.example .env

# 3. Deploy the Stack
docker compose up -d --build

# 4. Seed the Database
docker compose run --rm gateway python seed.py
```

## <img src="https://api.iconify.design/lucide:globe.svg?color=%23009688" width="24" align="center"> Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend App** | [localhost:5173](http://localhost:5173/Apex%20Vision%20Vendedor.html) | Demo User |
| **API Docs** | [localhost:8080/docs](http://localhost:8080/docs) | - |
| **RabbitMQ** | [localhost:15672](http://localhost:15672) | `guest` / `guest` |
| **MinIO** | [localhost:9001](http://localhost:9001) | `minioadmin` / `minioadmin` |

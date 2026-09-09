# Sentinel-X Website Backend & PostgreSQL Setup Guide

This guide describes how to run the PostgreSQL database container using Docker Desktop and start the Sentinel-X Website Spring Boot backend.

---

## Architecture Overview

```
Docker Desktop (PostgreSQL Container)
         ↓ Port 5432
Spring Boot Backend (apps/website/backend)
         ↓ 
Spring Data JPA / PostgreSQL JDBC Driver
         ↓
Health Endpoint (GET /api/health)
```

---

## Prerequisites

1. **Docker Desktop**: Installed and running on Windows.
2. **Java JDK 21**: Installed.
3. **Maven / `./mvnw`**: Bundled inside `apps/website/backend/`.

---

## 1. Start Docker Desktop

Launch **Docker Desktop** on Windows and ensure the Docker engine status shows **Running**.

You can verify Docker availability from PowerShell or CMD:

```powershell
docker compose version
```

---

## 2. Start PostgreSQL Container

Navigate to the PostgreSQL Docker infrastructure directory:

```powershell
cd infrastructure/docker/postgres
```

Start the container in detached mode:

```powershell
docker compose up -d
```

Verify that the PostgreSQL container (`sentinelx-postgres`) is running:

```powershell
docker ps
```

---

## 3. Database Details & Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DB_HOST` | `localhost` | Database host |
| `DB_PORT` | `5432` | Database port |
| `DB_NAME` | `sentinelx_website_db` | Database name |
| `DB_USERNAME` | `sentinelx_user` | Database user |
| `DB_PASSWORD` | `sentinelx_pass` | Database password |

*(Note: Safe default values are configured in `application.yml` for local development).*

---

## 4. Start Spring Boot Backend

Navigate to the backend application directory:

```powershell
cd apps/website/backend
```

Run the application using the Maven Wrapper:

```powershell
./mvnw spring-boot:run
```

Alternatively, build the package first:

```powershell
./mvnw clean package
java -jar target/website-0.0.1-SNAPSHOT.jar
```

The Spring Boot application will start on `http://localhost:8080`.

---

## 5. Verify Database Connection & Health Endpoint

Once Spring Boot has started, verify database connectivity by making a GET request to the health endpoint:

```powershell
curl http://localhost:8080/api/health
```

### Expected Response (HTTP 200 OK):

```json
{
  "service": "Sentinel-X Website Backend",
  "status": "UP",
  "database": "CONNECTED",
  "timestamp": "2026-09-09T00:58:00Z"
}
```

---

## 6. Stop PostgreSQL Container

To stop the PostgreSQL container without removing persistent data:

```powershell
cd infrastructure/docker/postgres
docker compose down
```

To stop the container **and** delete the persistent database volume (resets data):

```powershell
docker compose down -v
```

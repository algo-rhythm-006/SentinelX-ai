from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.audit import router as audit_router
from routers.remediation import router as remediation_router

app = FastAPI(
    title="SentinelX Desktop Backend API",
    description="Automated Security Audit, Triage, and Blue Team Remediation Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(audit_router)
app.include_router(remediation_router)

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "SentinelX Desktop Backend"}

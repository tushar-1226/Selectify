import json
import os
import uuid
import shutil
from fastapi import FastAPI, Depends, HTTPException, status, Header, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import Optional

from database import engine, get_db, Base
from models import User, ResumeAnalysis, Resume, DSAProgress, DSAGoal, MockSession
from schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    ResumeAnalysisRequest,
    UserProfileUpdateRequest,
    DSAProgressSaveRequest,
    DSAGoalCreateRequest,
    MockSessionCreateRequest,
)
from auth import hash_password, verify_password, create_access_token, decode_access_token

# Create all tables on startup
Base.metadata.create_all(bind=engine)

# Ensure upload directories exist
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
AVATAR_DIR = os.path.join(UPLOAD_DIR, "avatars")
RESUME_DIR = os.path.join(UPLOAD_DIR, "resumes")
os.makedirs(AVATAR_DIR, exist_ok=True)
os.makedirs(RESUME_DIR, exist_ok=True)

app = FastAPI(title="Selectify API", version="1.0.0")

# CORS — allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files as static
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# ---------------------------------------------------------------------------
# Dependency: extract current user from JWT token
# ---------------------------------------------------------------------------
def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    """Extract and validate the JWT from the Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = authorization.split(" ", 1)[1]
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user_id = payload.get("id")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/api/health")
def health_check():
    return {"status": "ok"}


# ---------------------------------------------------------------------------
# User Registration
# ---------------------------------------------------------------------------
@app.post("/api/register")
def register(data: UserRegisterRequest, db: Session = Depends(get_db)):
    if not data.email or not data.password:
        raise HTTPException(status_code=400, detail="Email and password required")

    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=409, detail="User already exists")

    hashed = hash_password(data.password)
    user = User(email=data.email, password_hash=hashed, name=data.name)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate JWT token
    token = create_access_token({"id": user.id, "email": user.email, "name": user.name})

    return {
        "success": True,
        "token": token,
        "user": {"id": user.id, "email": user.email, "name": user.name},
    }


# ---------------------------------------------------------------------------
# User Login
# ---------------------------------------------------------------------------
@app.post("/api/login")
def login(data: UserLoginRequest, db: Session = Depends(get_db)):
    if not data.email or not data.password:
        raise HTTPException(status_code=400, detail="Email and password required")

    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate JWT token
    token = create_access_token({"id": user.id, "email": user.email, "name": user.name})

    return {
        "success": True,
        "token": token,
        "user": {"id": user.id, "email": user.email, "name": user.name},
    }


# ---------------------------------------------------------------------------
# Profile — Get
# ---------------------------------------------------------------------------
@app.get("/api/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "success": True,
        "profile": {
            "id": current_user.id,
            "email": current_user.email,
            "name": current_user.name,
            "bio": current_user.bio or "",
            "profile_picture_url": current_user.profile_picture_url,
        },
    }


# ---------------------------------------------------------------------------
# Profile — Update
# ---------------------------------------------------------------------------
@app.put("/api/profile")
def update_profile(
    data: UserProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.name is not None:
        current_user.name = data.name
    if data.email is not None:
        # Check if email is taken by someone else
        existing = db.query(User).filter(User.email == data.email, User.id != current_user.id).first()
        if existing:
            raise HTTPException(status_code=409, detail="Email already in use")
        current_user.email = data.email
    if data.bio is not None:
        current_user.bio = data.bio

    db.commit()
    db.refresh(current_user)

    return {
        "success": True,
        "profile": {
            "id": current_user.id,
            "email": current_user.email,
            "name": current_user.name,
            "bio": current_user.bio or "",
            "profile_picture_url": current_user.profile_picture_url,
        },
    }


# ---------------------------------------------------------------------------
# Avatar — Upload
# ---------------------------------------------------------------------------
@app.post("/api/upload-avatar")
def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Validate file type
    allowed_types = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP, and GIF images are allowed")

    # Generate unique filename
    ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "png"
    filename = f"{current_user.id}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join(AVATAR_DIR, filename)

    # Save file
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Update user record
    avatar_url = f"/uploads/avatars/{filename}"
    current_user.profile_picture_url = avatar_url
    db.commit()
    db.refresh(current_user)

    return {"success": True, "profile_picture_url": avatar_url}


# ---------------------------------------------------------------------------
# Resume — Upload
# ---------------------------------------------------------------------------
@app.post("/api/resumes")
def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Validate file type
    allowed_types = {"application/pdf", "text/plain", "application/msword",
                     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only PDF, TXT, DOC, and DOCX files are allowed")

    # Generate unique filename
    ext = file.filename.rsplit(".", 1)[-1] if "." in file.filename else "pdf"
    safe_name = f"{current_user.id}_{uuid.uuid4().hex[:8]}.{ext}"
    filepath = os.path.join(RESUME_DIR, safe_name)

    # Save file
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    resume = Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=f"/uploads/resumes/{safe_name}",
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "success": True,
        "resume": {
            "id": resume.id,
            "filename": resume.filename,
            "file_path": resume.file_path,
            "uploaded_at": resume.uploaded_at.isoformat() if resume.uploaded_at else None,
        },
    }


# ---------------------------------------------------------------------------
# Resume — List
# ---------------------------------------------------------------------------
@app.get("/api/resumes")
def list_resumes(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.uploaded_at.desc()).all()
    resumes = [
        {
            "id": r.id,
            "filename": r.filename,
            "file_path": r.file_path,
            "uploaded_at": r.uploaded_at.isoformat() if r.uploaded_at else None,
        }
        for r in rows
    ]
    return {"success": True, "resumes": resumes}


# ---------------------------------------------------------------------------
# Resume — Delete
# ---------------------------------------------------------------------------
@app.delete("/api/resumes/{resume_id}")
def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    # Delete file from disk
    full_path = os.path.join(os.path.dirname(__file__), resume.file_path.lstrip("/"))
    if os.path.exists(full_path):
        os.remove(full_path)

    db.delete(resume)
    db.commit()

    return {"success": True}


# ---------------------------------------------------------------------------
# Resume Analysis — Save (protected)
# ---------------------------------------------------------------------------
@app.post("/api/resume-analysis")
def save_analysis(
    data: ResumeAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    analysis = ResumeAnalysis(
        user_id=data.userId,
        resume_text=data.resumeText,
        analysis_data=json.dumps(data.analysisData) if not isinstance(data.analysisData, str) else data.analysisData,
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return {"success": True, "id": analysis.id}


# ---------------------------------------------------------------------------
# Resume Analysis — Get by user (protected)
# ---------------------------------------------------------------------------
@app.get("/api/resume-analysis/{user_id}")
def get_analyses(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.query(ResumeAnalysis).filter(ResumeAnalysis.user_id == user_id).all()
    analyses = [
        {
            "id": r.id,
            "user_id": r.user_id,
            "resume_text": r.resume_text,
            "analysis_data": r.analysis_data,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in rows
    ]
    return {"success": True, "analyses": analyses}


# ---------------------------------------------------------------------------
# DSA Progress — Get all progress for current user
# ---------------------------------------------------------------------------
@app.get("/api/dsa/progress")
def get_dsa_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.query(DSAProgress).filter(DSAProgress.user_id == current_user.id).all()
    progress_map = {}
    for p in rows:
        progress_map[p.problem_id] = {
            "status": p.status,
            "isCorrect": p.is_correct,
            "submittedCode": p.submitted_code,
            "language": p.language,
            "aiReview": p.ai_review,
        }
    return {"success": True, "progressMap": progress_map}


# ---------------------------------------------------------------------------
# DSA Progress — Upsert progress for a specific problem
# ---------------------------------------------------------------------------
@app.post("/api/dsa/progress")
def save_dsa_progress(
    data: DSAProgressSaveRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(DSAProgress).filter(
        DSAProgress.user_id == current_user.id,
        DSAProgress.problem_id == data.problemId,
    ).first()

    if existing:
        existing.status = "solved"
        existing.is_correct = data.isCorrect
        existing.submitted_code = data.submittedCode
        existing.language = data.language
        existing.ai_review = data.aiReview
    else:
        existing = DSAProgress(
            user_id=current_user.id,
            problem_id=data.problemId,
            status="solved",
            is_correct=data.isCorrect,
            submitted_code=data.submittedCode,
            language=data.language,
            ai_review=data.aiReview,
        )
        db.add(existing)

    db.commit()
    return {"success": True}


# ---------------------------------------------------------------------------
# DSA Goals — List
# ---------------------------------------------------------------------------
@app.get("/api/dsa/goals")
def list_dsa_goals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.query(DSAGoal).filter(DSAGoal.user_id == current_user.id).order_by(DSAGoal.created_at.desc()).all()
    goals = [
        {
            "id": str(g.id),
            "title": g.title,
            "targetCount": g.target_count,
            "category": g.category,
            "difficulty": g.difficulty,
        }
        for g in rows
    ]
    return {"success": True, "goals": goals}


# ---------------------------------------------------------------------------
# DSA Goals — Create
# ---------------------------------------------------------------------------
@app.post("/api/dsa/goals")
def create_dsa_goal(
    data: DSAGoalCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not data.title:
        raise HTTPException(status_code=400, detail="Title is required")

    goal = DSAGoal(
        user_id=current_user.id,
        title=data.title,
        target_count=data.targetCount,
        category=data.category if data.category != "All" else None,
        difficulty=data.difficulty if data.difficulty != "All" else None,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return {"success": True, "goal": {"id": str(goal.id), "title": goal.title}}


# ---------------------------------------------------------------------------
# DSA Goals — Delete
# ---------------------------------------------------------------------------
@app.delete("/api/dsa/goals/{goal_id}")
def delete_dsa_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    goal = db.query(DSAGoal).filter(DSAGoal.id == goal_id, DSAGoal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
    return {"success": True}


# ---------------------------------------------------------------------------
# Mock Interviews — List past sessions
# ---------------------------------------------------------------------------
@app.get("/api/mock-interviews")
def list_mock_interviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rows = db.query(MockSession).filter(
        MockSession.user_id == current_user.id,
        MockSession.completed_at.isnot(None)
    ).order_by(MockSession.started_at.desc()).limit(10).all()
    
    sessions = []
    for s in rows:
        sessions.append({
            "id": s.id,
            "type": s.type,
            "difficulty": s.difficulty,
            "overallScore": s.overall_score,
            "startedAt": s.started_at.isoformat() if s.started_at else None,
            "completedAt": s.completed_at.isoformat() if s.completed_at else None,
        })
    return {"success": True, "history": sessions}


# ---------------------------------------------------------------------------
# Mock Interviews — Save session
# ---------------------------------------------------------------------------
@app.post("/api/mock-interviews")
def save_mock_interview(
    data: MockSessionCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = MockSession(
        user_id=current_user.id,
        type=data.type,
        difficulty=data.difficulty,
        target_role=data.targetRole,
        overall_score=data.overallScore,
        questions_data=data.questionsData,
        answers_data=data.answersData,
        evaluations_data=data.evaluationsData,
        completed_at=func.now()
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"success": True, "id": session.id}


from pydantic import BaseModel
from typing import Optional, Any, List
from datetime import datetime


class UserRegisterRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: str
    password: str


class ResumeAnalysisRequest(BaseModel):
    userId: int
    resumeText: str
    analysisData: Any


class UserProfileResponse(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    bio: Optional[str] = None
    profile_picture_url: Optional[str] = None


class UserProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None


class ResumeResponse(BaseModel):
    id: int
    filename: str
    file_path: str
    resume_text: Optional[str] = None
    uploaded_at: Optional[str] = None
    updated_at: Optional[str] = None


class DSAProgressSaveRequest(BaseModel):
    problemId: str
    isCorrect: bool
    submittedCode: Optional[str] = None
    language: Optional[str] = None
    aiReview: Optional[str] = None


class DSAGoalCreateRequest(BaseModel):
    title: str
    targetCount: int = 5
    category: Optional[str] = None
    difficulty: Optional[str] = None


class MockSessionResponse(BaseModel):
    id: int
    type: str
    difficulty: str
    overallScore: Optional[float] = None
    startedAt: Optional[str] = None
    completedAt: Optional[str] = None


class MockSessionCreateRequest(BaseModel):
    type: str
    difficulty: str
    targetRole: str
    overallScore: float
    questionsData: str
    answersData: str
    evaluationsData: str


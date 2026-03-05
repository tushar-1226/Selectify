from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=True)
    bio = Column(Text, nullable=True, default="")
    profile_picture_url = Column(String, nullable=True, default=None)

    analyses = relationship("ResumeAnalysis", back_populates="user")
    resumes = relationship("Resume", back_populates="user")
    dsa_progress = relationship("DSAProgress", back_populates="user")
    dsa_goals = relationship("DSAGoal", back_populates="user")
    mock_sessions = relationship("MockSession", back_populates="user")


class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    resume_text = Column(Text, nullable=False)
    analysis_data = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="analyses")


class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    resume_text = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="resumes")


class DSAProgress(Base):
    __tablename__ = "dsa_progress"
    __table_args__ = (UniqueConstraint("user_id", "problem_id", name="uq_user_problem"),)

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    problem_id = Column(String, nullable=False, index=True)
    status = Column(String, nullable=False, default="unsolved")  # unsolved, solved
    is_correct = Column(Boolean, nullable=False, default=False)
    submitted_code = Column(Text, nullable=True)
    language = Column(String, nullable=True)
    ai_review = Column(Text, nullable=True)
    submitted_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="dsa_progress")


class DSAGoal(Base):
    __tablename__ = "dsa_goals"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    target_count = Column(Integer, nullable=False, default=5)
    category = Column(String, nullable=True)
    difficulty = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="dsa_goals")


class MockSession(Base):
    __tablename__ = "mock_sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    target_role = Column(String, nullable=True)
    overall_score = Column(Integer, nullable=True)
    questions_data = Column(Text, nullable=True)
    answers_data = Column(Text, nullable=True)
    evaluations_data = Column(Text, nullable=True)
    started_at = Column(DateTime, server_default=func.now())
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="mock_sessions")



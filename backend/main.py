from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import asyncio
from instagrapi import Client
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Instagram Follow Checker API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://thinkb1g.github.io/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 요청 모델
class UsernameRequest(BaseModel):
    username: str

class FollowersRequest(BaseModel):
    username: str
    target_usernames: List[str]

# 응답 모델
class UserInfoResponse(BaseModel):
    user_id: int
    username: str
    full_name: str
    follower_count: int
    following_count: int
    is_private: bool

class FollowersResponse(BaseModel):
    followers: List[str]
    total_count: int

class ComparisonResponse(BaseModel):
    non_mutuals: List[str]
    total_targets: int
    non_mutual_count: int

# Instagram 클라이언트 인스턴스 (전역)
cl = Client()

@app.get("/")
async def root():
    return {"message": "Instagram Follow Checker API"}

@app.post("/api/user-info", response_model=UserInfoResponse)
async def get_user_info(request: UsernameRequest):
    """사용자명으로 사용자 정보 조회"""
    try:
        # 사용자 정보 조회
        user_info = cl.user_info_by_username(request.username)
        
        return UserInfoResponse(
            user_id=user_info.pk,
            username=user_info.username,
            full_name=user_info.full_name,
            follower_count=user_info.follower_count,
            following_count=user_info.following_count,
            is_private=user_info.is_private
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"사용자 정보를 가져올 수 없습니다: {str(e)}")

@app.post("/api/followers", response_model=FollowersResponse)
async def get_followers(request: UsernameRequest):
    """사용자의 팔로워 목록 조회"""
    try:
        # 사용자 ID 조회
        user_id = cl.user_id_from_username(request.username)
        
        # 팔로워 목록 조회
        followers = cl.user_followers(str(user_id), amount=0)  # amount=0은 모든 팔로워
        
        # 사용자명만 추출
        follower_usernames = [user.username for user in followers.values()]
        
        return FollowersResponse(
            followers=follower_usernames,
            total_count=len(follower_usernames)
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"팔로워 목록을 가져올 수 없습니다: {str(e)}")

@app.post("/api/compare-followers", response_model=ComparisonResponse)
async def compare_followers(request: FollowersRequest):
    """팔로워 목록과 대상 목록 비교"""
    try:
        # 사용자 ID 조회
        user_id = cl.user_id_from_username(request.username)
        
        # 팔로워 목록 조회
        followers = cl.user_followers(str(user_id), amount=0)
        follower_usernames = set(user.username.lower() for user in followers.values())
        
        # 대상 목록과 비교
        target_usernames = set(username.lower() for username in request.target_usernames)
        non_mutuals = list(target_usernames - follower_usernames)
        
        return ComparisonResponse(
            non_mutuals=non_mutuals,
            total_targets=len(request.target_usernames),
            non_mutual_count=len(non_mutuals)
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"팔로워 비교 중 오류가 발생했습니다: {str(e)}")

@app.post("/api/login")
async def login_instagram(username: str = Form(...), password: str = Form(...)):
    """Instagram 로그인 (개발/테스트용)"""
    try:
        cl.login(username, password)
        return {"message": "로그인 성공", "username": username}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"로그인 실패: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

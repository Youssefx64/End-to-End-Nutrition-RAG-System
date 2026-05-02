from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.future import select
from models.db_schemas.nutrition_rag.schemas.user import User
from jose import JWTError, jwt
from datetime import datetime, timedelta
import bcrypt
import os

auth_router = APIRouter(
    prefix="/api/v1/auth",
    tags=["auth"],
)

SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "nutrition-rag-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days


class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str
    full_name: str = None


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = auth_header.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    async with request.app.db_client() as session:
        result = await session.execute(select(User).where(User.id == int(user_id)))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user


@auth_router.post("/register")
async def register(request: Request, body: RegisterRequest):
    async with request.app.db_client() as session:
        existing = await session.execute(
            select(User).where(User.email == body.email)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already registered")

        existing_username = await session.execute(
            select(User).where(User.username == body.username)
        )
        if existing_username.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Username already taken")

        user = User(
            email=body.email,
            username=body.username,
            hashed_password=hash_password(body.password),
            full_name=body.full_name,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return JSONResponse(content={
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
        }
    })


@auth_router.post("/login")
async def login(request: Request, body: LoginRequest):
    async with request.app.db_client() as session:
        result = await session.execute(select(User).where(User.email == body.email))
        user = result.scalar_one_or_none()

    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id)})
    return JSONResponse(content={
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "full_name": user.full_name,
        }
    })


@auth_router.get("/me")
async def me(current_user: User = Depends(get_current_user)):
    return JSONResponse(content={
        "id": current_user.id,
        "email": current_user.email,
        "username": current_user.username,
        "full_name": current_user.full_name,
        "created_at": str(current_user.created_at),
    })


@auth_router.put("/me")
async def update_me(request: Request, current_user: User = Depends(get_current_user)):
    body = await request.json()
    async with request.app.db_client() as session:
        result = await session.execute(select(User).where(User.id == current_user.id))
        user = result.scalar_one_or_none()
        if body.get("full_name") is not None:
            user.full_name = body["full_name"]
        if body.get("username") is not None:
            user.username = body["username"]
        await session.commit()
        await session.refresh(user)

    return JSONResponse(content={
        "id": user.id,
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
    })

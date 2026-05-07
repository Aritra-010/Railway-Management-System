from fastapi import APIRouter
from pydantic import BaseModel
from db.connection import get_connection

router = APIRouter()

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

@router.post("/signup")
def signup_user(data: SignupRequest):
    conn = get_connection()
    cursor = conn.cursor()

    # check if mail ends with @gmail.com
    if not data.email.endswith("@gmail.com"):
        return {"message": "Invalid mail ID"}

    # check if email already exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (data.email,))
    existing_user = cursor.fetchone()

    if existing_user:
        return {"message": "Email already registered"}

    # insert new user
    query = "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)"
    cursor.execute(query, (data.name, data.email, data.password))
    conn.commit()

    return {"message": "Signup successful"}
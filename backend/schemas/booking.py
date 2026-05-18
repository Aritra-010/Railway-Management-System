from pydantic import BaseModel
from typing import List

class Passenger(BaseModel):
    name: str
    age: int
    gender: str
    coach_type: str

class BookingRequest(BaseModel):
    train_id: int
    journey_date: str
    phone_number: str
    source: str
    destination: str
    passengers: List[Passenger]
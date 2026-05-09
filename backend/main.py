from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.admin import station, train
from routes.user import train as user_train
from routes.user import ticket_booking
from routes.user import my_booking
#from routes.user import TrainStatus
from routes import signup, login
from routes.user import search_train
app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(signup.router)
app.include_router(login.router)

# Admin routes
app.include_router(station.router, prefix="/admin")
app.include_router(train.router, prefix="/admin")

# User routes
app.include_router(user_train.router, prefix="/user")
app.include_router(ticket_booking.router, prefix="/user/ticket-booking")
app.include_router(my_booking.router, prefix="/user/my-bookings")
app.include_router(search_train.router, prefix="/user")

@app.get("/")
def root():
    return {"message": "Backend running "}
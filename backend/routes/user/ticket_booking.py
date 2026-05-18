from fastapi import APIRouter, HTTPException, Query
from db.connection import get_connection
from schemas.booking import BookingRequest

import random
import json

router = APIRouter()

#  SEARCH TRAINS
@router.get("/search")
def search_trains(
    source: str = Query(...),
    destination: str = Query(...)
):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        query = """
        SELECT id, train_name, train_number, stations
        FROM trains
        WHERE LOWER(TRIM(%s)) = ANY(
            ARRAY(
                SELECT LOWER(TRIM(s))
                FROM unnest(stations) AS s
            )
        )
        AND LOWER(TRIM(%s)) = ANY(
            ARRAY(
                SELECT LOWER(TRIM(s))
                FROM unnest(stations) AS s
            )
        )
        """

        cursor.execute(query, (source, destination))
        rows = cursor.fetchall()

        trains = []
        for row in rows:
            trains.append({
                "train_id": row[0],
                "train_name": row[1],
                "train_number": row[2]
            })

        return {"trains": trains}

    except Exception as e:
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()


#  GET TRAIN DETAILS (Book button)
@router.get("/train-details/{train_id}")
def get_train_details(train_id: int, date: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        query = """
        SELECT train_name, train_number, stations
        FROM trains
        WHERE id = %s
        """

        cursor.execute(query, (train_id,))
        train = cursor.fetchone()

        if not train:
            return {"error": "Train not found"}

        return {
            "train_id": train_id,
            "train_name": train[0],
            "train_number": train[1],
            "stations": train[2],
            "journey_date": date
        }

    except Exception as e:
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()

# PNR generate
def generate_pnr():
    return "PNR" + str(random.randint(100000, 999999))

def generate_seats(count):
    coach = "S" + str(random.randint(1, 5))
    seats = [str(random.randint(1, 72)) for _ in range(count)]
    return coach, ",".join(seats)


#  CONFIRM BOOKING (MAIN API)
@router.post("/confirm")
def confirm_booking(data: BookingRequest):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
            SELECT train_name, train_number
            FROM trains
            WHERE id = %s
        """, (data.train_id,))
        
        train = cursor.fetchone()

        if not train:
            raise HTTPException(status_code=404, detail="Train not found")

        pnr = generate_pnr()
        coach, seat_numbers = generate_seats(len(data.passengers))
        total_fare = 200 * len(data.passengers)

        for p in data.passengers:
            if p.gender.upper() not in ["M", "F", "O"]:
                raise HTTPException(status_code=400, detail="Invalid gender")

            if p.coach_type.upper() not in ["GS", "SL", "3A", "2A", "1A", "CC", "2S"]:
                raise HTTPException(status_code=400, detail="Invalid coach type")

            cursor.execute("""
                INSERT INTO bookings (
                    pnr, train_id, train_name, train_number,
                    source, destination, journey_date,
                    phone_number,
                    pass_name, pass_age, pass_gender, coach_type,
                    coach, seat_numbers,
                    total_fare, status
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                pnr,
                data.train_id,
                train[0],
                train[1],
                data.source,
                data.destination,
                data.journey_date,
                data.phone_number,
                p.name,
                p.age,
                p.gender.upper(),       
                p.coach_type.upper(),    
                coach,
                seat_numbers,
                total_fare,
                "CONFIRMED"
            ))

        conn.commit()

        return {
            "message": "Ticket Booked Successfully",
            "pnr": pnr,
            "status": "CONFIRMED",
            "coach": coach,
            "seat_numbers": seat_numbers,
            "total_fare": total_fare
        }

    except HTTPException as e:
        conn.rollback()
        raise e  # 🔥 IMPORTANT

    except Exception as e:
        conn.rollback()
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Booking failed")

    finally:
        cursor.close()
        conn.close()
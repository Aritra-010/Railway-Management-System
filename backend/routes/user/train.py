from fastapi import APIRouter
from db.connection import get_connection

router = APIRouter()

@router.get("/stations")
def get_stations():
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT name FROM stations")
        rows = cursor.fetchall()
        stations = [row[0] for row in rows]
        return {"stations": stations}

    except Exception as e:
        return {"error": str(e)}

    finally:
        cursor.close()
        conn.close()

@router.get("/search-trains")
def search_trains(source: str, destination: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        query = """
        SELECT train_number, train_name, train_type,
               source, destination, total_seats
        FROM trains
        WHERE source = %s AND destination = %s;
        """

        cursor.execute(query, (source, destination))
        rows = cursor.fetchall()

        trains = []
        for row in rows:
            trains.append({
                "train_number": row[0],
                "train_name": row[1],
                "train_type": row[2],
                "source": row[3],
                "destination": row[4],
                "total_seats": row[5]
            })

        return trains

    except Exception as e:
        print("ERROR:", e)
        return {"error": "Something went wrong"}

    finally:
        cursor.close()
        conn.close()
        
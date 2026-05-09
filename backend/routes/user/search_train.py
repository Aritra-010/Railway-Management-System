from fastapi import APIRouter
from pydantic import BaseModel

from db.connection import get_connection

router = APIRouter()


class TrainSearch(BaseModel):
    source: str
    destination: str


@router.post("/search-trains")
def search_trains(data: TrainSearch):

    conn = get_connection()

    cursor = conn.cursor()

    query = """
        SELECT train_number, train_name
        FROM trains
        WHERE source = %s
        AND destination = %s
    """

    cursor.execute(
        query,
        (data.source, data.destination)
    )

    rows = cursor.fetchall()

    trains = []

    for row in rows:
        trains.append({
            "train_number": row[0],
            "train_name": row[1]
        })

    return {
        "trains": trains
    }

@router.get("/stations")
def get_stations():

    conn = get_connection()

    cursor = conn.cursor()

    query = """
        SELECT name
        FROM stations
        ORDER BY name
    """

    cursor.execute(query)

    rows = cursor.fetchall()

    stations = []

    for row in rows:
        stations.append(row[0])

    return {
        "stations": stations
    }
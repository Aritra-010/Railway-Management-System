from pydantic import BaseModel
class TrainSearch(BaseModel):
    source: str
    destination: str
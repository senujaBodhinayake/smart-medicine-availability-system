from fastapi import APIRouter
from database import medicine_collection


router = APIRouter(
    prefix="/medicines",
    tags=["Medicines"]
)


@router.get("/")
def get_medicines():

    data = list(
        medicine_collection.find(
            {},
            {"_id":0}
        )
    )

    return data
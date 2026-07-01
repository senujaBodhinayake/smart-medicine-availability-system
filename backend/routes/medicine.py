from fastapi import APIRouter, Query
from typing import Optional
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
            {"_id": 0}
        )
    )
    return data

@router.get("/search")
def search_medicines(
    q: Optional[str] = "",
    category: Optional[str] = None,
    stock_status: Optional[str] = None,
    age_group: Optional[str] = None
):
    query = {}
    
    if q:
        query["medicine_name"] = {"$regex": q, "$options": "i"}
        
    if category and category != "All":
        query["category"] = category
        
    if stock_status:
        query["stock_status"] = stock_status
        
    if age_group and age_group != "All Ages":
        query["age_group"] = {"$in": [age_group, "All Ages"]}
        
    data = list(
        medicine_collection.find(
            query,
            {"_id": 0}
        )
    )
    return data


@router.get("/{medicine_id}")
def get_medicine_by_id(medicine_id: int):
    data = medicine_collection.find_one(
        {"id": medicine_id},
        {"_id": 0}
    )
    if data is None:
        return {"error": "Medicine not found"}
    return data
from fastapi import APIRouter
import random

router = APIRouter(
    prefix="/forecast",
    tags=["Forecast"]
)

@router.get("/")
def get_forecast(medicine: str = ""):
    # Generate a mock but realistic looking 7-day forecast for the specific medicine
    # Since we don't have an ML model for this yet, we return static-like data.
    base_demand = random.randint(50, 200)
    
    forecast = [
        {"day": "Mon", "demand": base_demand + random.randint(-20, 20)},
        {"day": "Tue", "demand": base_demand + random.randint(-20, 20)},
        {"day": "Wed", "demand": base_demand + random.randint(-20, 20)},
        {"day": "Thu", "demand": base_demand + random.randint(-20, 20)},
        {"day": "Fri", "demand": base_demand + random.randint(-20, 20)},
        {"day": "Sat", "demand": base_demand + random.randint(-20, 20)},
        {"day": "Sun", "demand": base_demand + random.randint(-20, 20)},
    ]
    
    return forecast

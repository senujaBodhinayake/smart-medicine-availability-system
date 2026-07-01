from fastapi import FastAPI

from routes.medicine import router as medicine_router
from routes.recommendation import router as recommendation_router
from routes.prediction import router as prediction_router
from routes.forecast import router as forecast_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Smart Medicine API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

app.include_router(medicine_router)
app.include_router(recommendation_router)
app.include_router(prediction_router)
app.include_router(forecast_router)


@app.get("/")
def home():
    return {
        "message":"Smart Medicine Backend Running"
    }
from fastapi import FastAPI

from routes.medicine import router as medicine_router
from routes.recommendation import router as recommendation_router
from routes.prediction import router as prediction_router


app = FastAPI(
    title="Smart Medicine API"
)


app.include_router(medicine_router)
app.include_router(recommendation_router)
app.include_router(prediction_router)


@app.get("/")
def home():
    return {
        "message":"Smart Medicine Backend Running"
    }
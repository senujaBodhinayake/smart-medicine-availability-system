from fastapi import APIRouter
from tensorflow.keras.models import load_model
import pickle
import numpy as np


router = APIRouter(
    prefix="/stock-status",
    tags=["Stock"]
)


model = load_model(
    "models/stock_classifier.keras"
)


scaler = pickle.load(
    open(
    "models/stock_scaler.pkl",
    "rb"
    )
)


@router.post("/")
def stock_status(data:list):

    x=np.array(data)

    x=scaler.transform(x)


    prediction=model.predict(x)


    result=np.argmax(
        prediction,
        axis=1
    )


    return {
        "class":int(result[0])
    }
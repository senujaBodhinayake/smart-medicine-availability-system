from fastapi import APIRouter
import pickle
import pandas as pd


router = APIRouter(
    prefix="/recommend",
    tags=["Recommendation"]
)


medicine_df = pd.read_csv(
    "models/medicine_metadata.csv"
)


similarity = pickle.load(
    open(
        "models/similarity_matrix.pkl",
        "rb"
    )
)


@router.get("/{medicine}")
def recommend(medicine:str):

    if medicine not in medicine_df.medicine.values:
        return {
            "error":"Medicine not found"
        }


    idx = medicine_df[
        medicine_df.medicine == medicine
    ].index[0]


    scores = list(
        enumerate(similarity[idx])
    )


    scores = sorted(
        scores,
        key=lambda x:x[1],
        reverse=True
    )


    result=[]


    for i,score in scores[1:6]:

        result.append(
            {
            "medicine":
            medicine_df.iloc[i].medicine,

            "similarity":
            round(float(score),3)
            }
        )


    return result
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

    # Strip out dosages to match ML dataset (e.g., "Paracetamol 500mg" -> "Paracetamol")
    base_medicine = None
    for med in medicine_df.medicine.values:
        if med.lower() in medicine.lower():
            base_medicine = med
            break

    if not base_medicine:
        return []

    idx = medicine_df[
        medicine_df.medicine == base_medicine
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


    for rank, (i, score) in enumerate(scores[1:6], start=1):
        row = medicine_df.iloc[i]
        
        cat = row.category if "category" in row else "Unknown"
        age = row.age_group if "age_group" in row else "Unknown"
        
        result.append(
            {
                "rank": rank,
                "medicine_name": row.medicine,
                "category": cat,
                "age_group": age,
                "dosage_form": "Unknown",
                "similarity_score": int(round(float(score) * 100))
            }
        )


    return result
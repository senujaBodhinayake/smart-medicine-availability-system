from pymongo import MongoClient

client = MongoClient(
    "mongodb://localhost:27017/"
)

db = client["smart_medicine"]

medicine_collection = db["medicines"]
prediction_collection = db["predictions"]
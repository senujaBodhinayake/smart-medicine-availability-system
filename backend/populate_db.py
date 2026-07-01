import json
from pymongo import MongoClient

MOCK_MEDICINES = [
  { "id": 1,  "medicine_name": 'Paracetamol 500mg',   "category": 'Painkiller',       "stock_status": 'Sufficient', "pharmacy_name": 'MediPlus Pharmacy',  "quantity": 150, "unit_price": 25,  "age_group": 'All Ages',  "dosage_form": 'Tablet' },
  { "id": 2,  "medicine_name": 'Amoxicillin 250mg',   "category": 'Antibiotic',       "stock_status": 'Reorder',    "pharmacy_name": 'City Pharmacy',       "quantity": 20,  "unit_price": 45,  "age_group": 'Adult',     "dosage_form": 'Capsule' },
  { "id": 3,  "medicine_name": 'Metformin 500mg',     "category": 'Antidiabetic',     "stock_status": 'Overstock',  "pharmacy_name": 'HealthCare Plus',     "quantity": 400, "unit_price": 15,  "age_group": 'Adult',     "dosage_form": 'Tablet' },
  { "id": 4,  "medicine_name": 'Amlodipine 5mg',      "category": 'Antihypertensive', "stock_status": 'Sufficient', "pharmacy_name": 'Sunrise Pharmacy',    "quantity": 200, "unit_price": 30,  "age_group": 'Adult',     "dosage_form": 'Tablet' },
  { "id": 5,  "medicine_name": 'Cetirizine 10mg',     "category": 'Antihistamine',    "stock_status": 'Sufficient', "pharmacy_name": 'MediPlus Pharmacy',   "quantity": 300, "unit_price": 12,  "age_group": 'All Ages',  "dosage_form": 'Tablet' },
  { "id": 6,  "medicine_name": 'Ibuprofen 400mg',     "category": 'Painkiller',       "stock_status": 'Reorder',    "pharmacy_name": 'City Pharmacy',       "quantity": 18,  "unit_price": 20,  "age_group": 'Adult',     "dosage_form": 'Tablet' },
  { "id": 7,  "medicine_name": 'Omeprazole 20mg',     "category": 'Antacid',          "stock_status": 'Sufficient', "pharmacy_name": 'HealthCare Plus',     "quantity": 120, "unit_price": 35,  "age_group": 'Adult',     "dosage_form": 'Capsule' },
  { "id": 8,  "medicine_name": 'Vitamin C 500mg',     "category": 'Supplement',       "stock_status": 'Overstock',  "pharmacy_name": 'Sunrise Pharmacy',    "quantity": 480, "unit_price": 8,   "age_group": 'All Ages',  "dosage_form": 'Tablet' },
  { "id": 9,  "medicine_name": 'Insulin 100IU/mL',    "category": 'Antidiabetic',     "stock_status": 'Sufficient', "pharmacy_name": 'MediPlus Pharmacy',   "quantity": 50,  "unit_price": 250, "age_group": 'Adult',     "dosage_form": 'Injection' },
  { "id": 10, "medicine_name": 'Atorvastatin 20mg',   "category": 'Antihypertensive', "stock_status": 'Sufficient', "pharmacy_name": 'City Pharmacy',       "quantity": 180, "unit_price": 55,  "age_group": 'Adult',     "dosage_form": 'Tablet' },
  { "id": 11, "medicine_name": 'Azithromycin 500mg',  "category": 'Antibiotic',       "stock_status": 'Reorder',    "pharmacy_name": 'HealthCare Plus',     "quantity": 12,  "unit_price": 90,  "age_group": 'Adult',     "dosage_form": 'Tablet' },
  { "id": 12, "medicine_name": 'Loratadine 10mg',     "category": 'Antihistamine',    "stock_status": 'Sufficient', "pharmacy_name": 'Sunrise Pharmacy',    "quantity": 220, "unit_price": 18,  "age_group": 'All Ages',  "dosage_form": 'Tablet' },
]

client = MongoClient("mongodb://localhost:27017/")
db = client["smart_medicine"]
medicine_collection = db["medicines"]

medicine_collection.delete_many({})
medicine_collection.insert_many(MOCK_MEDICINES)
print(f"Successfully inserted {len(MOCK_MEDICINES)} medicines into MongoDB.")

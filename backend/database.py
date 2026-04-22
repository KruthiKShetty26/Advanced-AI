import json
import os
from datetime import datetime

# This file will act as our local database
DB_FILE = "data.json"

def save_report(original_text: str, analysis: dict, fda_data: list):
    new_entry = {
        "text": original_text,
        "analysis": analysis,
        "fda_data": fda_data,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    # Load existing data
    data = []
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r") as f:
            try:
                data = json.load(f)
            except:
                data = []
                
    # Add new report and save
    data.append(new_entry)
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=4)
    
    return "saved_locally"

def get_history(limit: int = 10):
    if not os.path.exists(DB_FILE):
        return []
    with open(DB_FILE, "r") as f:
        try:
            data = json.load(f)
            # Return newest reports first
            return data[::-1][:limit]
        except:
            return []
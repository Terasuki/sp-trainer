from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import database

app = FastAPI(title="RL Q-Table Explorer API")

# Configure Cross-Origin Resource Sharing (CORS)
# This allows your React frontend (usually running on localhost:5173) to fetch data from FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, swap "*" for your actual frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/q-table/random")
def read_random_state():
    data = database.get_random_state()
    if not data:
        raise HTTPException(status_code=404, detail="No states found in database")
    return data

@app.get("/api/q-table/{state_id}")
def read_state_by_id(state_id: int):
    data = database.get_state_by_id(state_id)
    if not data:
        raise HTTPException(status_code=404, detail=f"State {state_id} not found")
    return data
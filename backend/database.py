import sqlite3
import json
import random

DB_FILE = "q.db"

def get_db_connection():
    """Creates a connection to the SQLite file."""
    conn = sqlite3.connect(DB_FILE)
    # This allows us to access columns by name like row['q_values']
    conn.row_factory = sqlite3.Row
    return conn

def get_random_state():
    """Fetches a random state safely and efficiently."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # --- METHOD 1: Fast Uniform Random Row Selection ---
    # Instead of guessing raw offsets, we count total rows and use LIMIT/OFFSET
    cursor.execute("SELECT COUNT(*) FROM q_table;")
    total_rows = cursor.fetchone()[0]
    
    if total_rows == 0:
        conn.close()
        return None
        
    # Generate a random offset index based on our true row count
    random_offset = random.randint(0, total_rows - 1)
    
    # Grab 1 row skipping down to that random offset
    cursor.execute(
        "SELECT state_id, q_values FROM q_table LIMIT 1 OFFSET ?;", 
        (random_offset,)
    )
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            "state_id": row["state_id"],
            "q_values": json.loads(row["q_values"])
        }
    return None

def get_state_by_id(state_id: int):
    """Fetches a specific state's Q-values using the primary key index."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT state_id, q_values FROM q_table WHERE state_id = ?;", (state_id,))
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {
            "state_id": row["state_id"],
            "q_values": json.loads(row["q_values"])
        }
    return None
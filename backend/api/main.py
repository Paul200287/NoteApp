from fastapi import FastAPI, HTTPException
import sqlite3
import os
from Note import Note, UpdateNote, UpdateNoteContent
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow specific origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)

os.chdir(os.path.dirname(__file__))

DATABASE = "../data/app.db"

def get_db_connection():
    """
    Erstellt eine Verbindung zur SQLite-Datenbank.
    """
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/get-notes")
def read_user():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(f"SELECT id, name FROM note")
    rows = cursor.fetchall()
    conn.close()

    if rows:
        notes = [{"id": row[0], "name": row[1]} for row in rows]
        return {"notes": notes}
    raise HTTPException(status_code=404, detail="Note not found")

@app.get("/note/{note_id}")
def read_user(note_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(f"SELECT * FROM note WHERE id = {note_id};")
    row = cursor.fetchone()
    conn.close()

    if row:
        return {"note": dict(row)}
    raise HTTPException(status_code=404, detail="Note not found")

@app.post("/create-note")
def create_note(note: Note):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO note (name, text) VALUES (?, ?)", (note.name, note.text))
    conn.commit()
    conn.close()

    return {"message": "Note created successfully"}

@app.put("/update-note-content/{note_id}")
def update_note_content(note_id: int, content: UpdateNoteContent):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("UPDATE note SET text = ? WHERE Id = ?", (content.newContent, note_id))
    conn.commit()
    conn.close()

    return {"message": "Note updated succesfully"}

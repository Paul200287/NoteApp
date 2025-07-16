from fastapi import FastAPI, HTTPException, Depends
import sqlite3
import os
from Note import Note, UpdateNote, UpdateNoteContent, User
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
import jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = "SECRET"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

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


def verify_user(username: str, password: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, hashed_password FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    conn.close()
    if row and pwd_context.verify(password, row[1]):
        return row[0]
    return None


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.exceptions.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("user_id")
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username FROM users WHERE id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return {"id": row[0], "username": row[1]}
    raise HTTPException(status_code=401, detail="User not found")

@app.post("/register")
def register(user: User):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (username, hashed_password) VALUES (?, ?)",
            (user.username, pwd_context.hash(user.password)),
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="User already exists")
    conn.close()
    return {"message": "User registered"}


@app.post("/login")
def login(user: User):
    user_id = verify_user(user.username, user.password)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode({"user_id": user_id}, SECRET_KEY, algorithm="HS256")
    return {"access_token": token}


@app.get("/get-notes")
def get_notes(current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(f"SELECT id, name FROM note WHERE user_id LIKE {current_user["id"]}")
    rows = cursor.fetchall()
    conn.close()

    if rows:
        notes = [{"id": row[0], "name": row[1]} for row in rows]
        return {"notes": notes}
    raise HTTPException(status_code=404, detail="Note not found")

@app.get("/note/{note_id}")
def get_note(note_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(f"SELECT * FROM note WHERE id = {note_id};")
    row = cursor.fetchone()
    conn.close()

    if row:
        return {"note": dict(row)}
    raise HTTPException(status_code=404, detail="Note not found")

@app.post("/create-note")
def create_note(note: Note, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("INSERT INTO note (name, text, user_id) VALUES (?, ?, ?)", (note.name, note.text, current_user["id"]))
    conn.commit()
    conn.close()

    return {"message": "Note created successfully"}

@app.put("/update-note-content/{note_id}")
def update_note_content(note_id: int, content: UpdateNoteContent, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("UPDATE note SET text = ? WHERE Id = ?", (content.newContent, note_id))
    conn.commit()
    conn.close()

    return {"message": "Note updated succesfully"}


@app.delete("/delete-note/{note_id}")
def delete_note(note_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM note WHERE id = ?", (note_id,))
    conn.commit()
    conn.close()
    return {"message": "Note deleted"}

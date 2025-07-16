import sqlite3
import os

def create_database():
    os.chdir(os.path.dirname(__file__))
    
    conn = sqlite3.connect("../data/app.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS note (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            text TEXT
        );
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            hashed_password TEXT NOT NULL
        );
    """)

    conn.commit()
    conn.close()
    print("Datenbank und Tabellen erfolgreich erstellt.")

if __name__ == "__main__":
    create_database()

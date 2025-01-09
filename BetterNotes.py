import os
import subprocess
import webbrowser
import threading
import time

def start_backend():
    backend_path = os.path.join(os.getcwd(), "backend/api")
    subprocess.Popen(
        ["uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=backend_path
    )

def start_frontend():
    time.sleep(3)
    frontend_path = os.path.join(os.getcwd(), "frontend")
    subprocess.Popen(
        ["npm", "start"],
        cwd=frontend_path
    )
    webbrowser.open("http://127.0.0.1:3000")

if __name__ == "__main__":
    backend_thread = threading.Thread(target=start_backend)
    backend_thread.start()

    start_frontend()

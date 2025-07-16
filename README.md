# Guide

This guide will show you, how to start this basic Note App.

## Backend

First, it is recommended to create a virtual environment. Therefore (Windows):

```bash
cd .\NoteApp\backend\
python -m venv venv
.\venv\Scripts\activate
```

Next, create the database if there is no .db file in *backend/data*
```bash
python .\db\init_db.py
```

Now, change to the *backend/api* directory and start FastAPI

```bash
cd .\api\
fastapi dev
```

## Frontend

Change to the */frontend* directory and execute the following command

```bash
npm install
```

To start the frontend, execute the following command

```bash
npm start
```
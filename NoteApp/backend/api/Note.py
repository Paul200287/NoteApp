from pydantic import BaseModel
from typing import Optional

class Note(BaseModel):
    name: str
    text: str

class UpdateNote(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    text: Optional[str] = None

class UpdateNoteContent(BaseModel):
    newContent: str


class User(BaseModel):
    username: str
    password: str

import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv

load_dotenv()

#confifuracion de base de datos
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:1234@localhost:5433/parcial_db"
)

# El engine es el "conector" entre Python y PostgreSQL.

engine = create_engine(DATABASE_URL, echo=True)

#creacion de tablas
def create_db_and_tables():
    """Crea todas las tablas en la DB si no existen todavía."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """
    Generador que crea una sesión de DB por cada request.
    FastAPI llama esto automáticamente gracias a Depends().
    El 'with' garantiza que la sesión se cierra aunque haya un error.
    """
    with Session(engine) as session:
        yield session

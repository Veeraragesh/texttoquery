from pydantic import BaseModel

class DBConfig(BaseModel):
    db_type: str 
    host: str
    port: int
    username: str
    password: str
    database: str

class QueryRequest(BaseModel):
    db_config: DBConfig
    prompt: str
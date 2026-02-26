from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from schemas import QueryRequest
from db_connector import create_dynamic_engine, get_table_schema
from llm_service import generate_sql

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/query")
async def run_query(request: QueryRequest):

    try:
        engine = create_dynamic_engine(request.db_config)
        schema = get_table_schema(engine)

        sql_query = await generate_sql(request.prompt, schema)
        print("Generated SQL:", sql_query)

        with engine.connect() as conn:
            result = conn.execute(text(sql_query))
            rows = result.fetchall()
            columns = result.keys()

        return {
            "generated_sql": sql_query,
            "columns": list(columns),
            "data": [
                dict(zip(columns, row))
                for row in rows
            ]
        }

    except ValueError as ve:
        # Controlled errors
        raise HTTPException(status_code=400, detail=str(ve))

    except Exception as e:
        # Unexpected errors
        raise HTTPException(
            status_code=500,
            detail=f"Internal error: {str(e)}"
        )
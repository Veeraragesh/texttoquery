import httpx
import json
import re

OLLAMA_URL = "http://localhost:11434/api/generate"

def clean_sql_response(response_text: str) -> str:
    if not response_text:
        return ""
    print("Raw LLM response:", response_text)
    # Remove markdown
    response_text = re.sub(r"```sql|```", "", response_text)

    response_text = response_text.strip()

    # Find first SELECT
    match = re.search(r"select\s+.*", response_text, re.IGNORECASE | re.DOTALL)

    if match:
        sql = match.group(0)

        # Stop at first semicolon if exists
        if ";" in sql:
            sql = sql.split(";")[0] + ";"

        return sql.strip()

    return response_text.strip()


def validate_sql(sql: str):

    sql_stripped = sql.strip()

    # Must start with SELECT
    if not re.match(r"^select\b", sql_stripped, re.IGNORECASE):
        raise ValueError("Only SELECT queries are allowed")

    # Forbidden SQL statements (whole words only)
    forbidden_keywords = [
        "insert", "update", "delete",
        "drop", "alter", "truncate",
        "create"
    ]

    for keyword in forbidden_keywords:
        if re.search(rf"\b{keyword}\b", sql_stripped, re.IGNORECASE):
            raise ValueError(f"Forbidden SQL keyword detected: {keyword}")


async def generate_sql(prompt, schema):

    system_prompt = f"""
You are a SQL expert.

Based on this database schema:
{json.dumps(schema, indent=2)}

Rules:
- Generate ONLY valid SQL
- Only SELECT queries
- No explanations
- No markdown
- No comments
"""

    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.post(
            OLLAMA_URL,
            json={
                "model": "mistral",
                "prompt": system_prompt + "\nUser: " + prompt,
                "stream": False,
                "options": {
                    "temperature": 0,
                    "num_predict": 150,
                    "num_ctx": 2048
                }
            }
        )

    data = response.json()
    raw_sql = data.get("response", "")

    cleaned_sql = clean_sql_response(raw_sql)

    if not cleaned_sql:
        raise ValueError("LLM returned empty SQL")

    validate_sql(cleaned_sql)

    return cleaned_sql
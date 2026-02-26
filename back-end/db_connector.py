from sqlalchemy import create_engine, text
from urllib.parse import quote_plus


def create_dynamic_engine(config):

    if not config.password:
        raise ValueError("Database password is required")

    if config.db_type == "postgresql":
        url = (
            f"postgresql+psycopg2://{config.username}:"
            f"{quote_plus(config.password)}@"
            f"{config.host}:{config.port}/{config.database}"
        )

    elif config.db_type == "mysql":
        url = (
            f"mysql+pymysql://{config.username}:"
            f"{quote_plus(config.password)}@"
            f"{config.host}:{config.port}/{config.database}"
        )

    else:
        raise ValueError("Unsupported DB type")

    engine = create_engine(url, pool_pre_ping=True)
    return engine


def get_table_schema(engine):

    schema_info = {}

    with engine.connect() as conn:

        tables = conn.execute(text("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
        """)).fetchall()

        for row in tables:
            table = row[0]

            columns = conn.execute(
                text("""
                    SELECT column_name, data_type
                    FROM information_schema.columns
                    WHERE table_name = :table
                """),
                {"table": table}
            ).fetchall()

            schema_info[table] = [
                {"column": col[0], "type": col[1]}
                for col in columns
            ]

    return schema_info
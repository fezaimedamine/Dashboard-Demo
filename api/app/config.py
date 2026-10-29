from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    database_url: str = "postgresql+psycopg://nocturne:nocturne@localhost:5433/nocturne"
    cors_origins: str = "http://127.0.0.1:3000,http://localhost:3000"


@lru_cache
def get_settings() -> Settings:
    return Settings()

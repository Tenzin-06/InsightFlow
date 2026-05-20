from .base import *  # noqa: F401, F403

DEBUG = True

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

LOGGING["loggers"]["django"]["level"] = "INFO"  # noqa: F405
LOGGING["loggers"]["django.utils.autoreload"] = {  # noqa: F405
    "handlers": ["console"],
    "level": "WARNING",
    "propagate": False,
}

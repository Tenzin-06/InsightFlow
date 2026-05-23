import environ
from pathlib import Path

env = environ.Env()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("SECRET_KEY")

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])

DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "corsheaders",
]

LOCAL_APPS = [
    "apps.core",
    "apps.authentication",
    "apps.users",
    "apps.surveys",
    "apps.responses",
    "apps.public_surveys",
    "apps.analytics",
    "apps.campaigns",
    "apps.sharing",
    "apps.email_campaigns",
    "apps.automation",
    "apps.engagement",
    "apps.engagement_optimization",
    "apps.ai",
    "apps.ai_analytics",
    "apps.simulation",
    "apps.reports",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# â”€â”€ Analytics caching â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
# Uses Redis when REDIS_URL is configured; falls back to local-memory cache
# in development environments that don't have Redis running.
_REDIS_URL = env("REDIS_URL", default="")

if _REDIS_URL:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": _REDIS_URL,
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
                "IGNORE_EXCEPTIONS": True,  # Degrade gracefully if Redis is down
            },
        },
        "analytics": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": _REDIS_URL,
            "KEY_PREFIX": "insightflow_analytics",
            "TIMEOUT": 60 * 15,  # 15 minutes default TTL
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
                "IGNORE_EXCEPTIONS": True,
            },
        },
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "insightflow-default",
        },
        "analytics": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "insightflow-analytics",
        },
    }

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
    ],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "apps.authentication.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "apps.authentication.permissions.IsAuthenticated",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "120/minute",
        "engagement": "600/minute",
    },
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 20,
}

# Resend email delivery
RESEND_API_KEY = env("RESEND_API_KEY", default="")
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="noreply@insightflow.ai")
RESEND_AUDIENCE_DOMAIN = env("RESEND_AUDIENCE_DOMAIN", default="insightflow.ai")
APP_FRONTEND_URL = env("APP_FRONTEND_URL", default="http://localhost:5173")
APP_BACKEND_URL = env("APP_BACKEND_URL", default="http://localhost:8000")

# â”€â”€ Gemini AI configuration â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
GEMINI_API_KEY = env("GEMINI_API_KEY", default="")
GEMINI_MODEL = env("GEMINI_MODEL", default="gemini-1.5-flash")
AI_TIMEOUT_SECONDS = int(env("AI_TIMEOUT_SECONDS", default="30"))
AI_MAX_RETRIES = int(env("AI_MAX_RETRIES", default="3"))
AI_ENABLE_LOGGING = env.bool("AI_ENABLE_LOGGING", default=True)

# Trigger.dev -- background job infrastructure
TRIGGER_SECRET_KEY = env("TRIGGER_SECRET_KEY", default="")
TRIGGER_PROJECT_ID = env("TRIGGER_PROJECT_ID", default="")
TRIGGER_API_URL = env("TRIGGER_API_URL", default="https://api.trigger.dev")
TRIGGER_INTERNAL_SECRET = env("TRIGGER_INTERNAL_SECRET", default="")

# Simulation Mode Foundation (Unit 33a)
# ---------------------------------------------------------------------------
SIMULATION_MODE_ENABLED = env.bool("SIMULATION_MODE_ENABLED", default=True)
SIMULATION_MAX_RESPONSES = env.int("SIMULATION_MAX_RESPONSES", default=10000)
SIMULATION_MAX_AI_JOBS = env.int("SIMULATION_MAX_AI_JOBS", default=25)
SIMULATION_MAX_RUNTIME_MINUTES = env.int("SIMULATION_MAX_RUNTIME_MINUTES", default=60)
SIMULATION_MAX_CONCURRENT_RUNS = env.int("SIMULATION_MAX_CONCURRENT_RUNS", default=2)
SIMULATION_ALLOW_EXTERNAL_API = env.bool("SIMULATION_ALLOW_EXTERNAL_API", default=False)
SIMULATION_AI_QUEUE_NAME = env("SIMULATION_AI_QUEUE_NAME", default="simulation-ai-queue")

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "django.db.backends": {
            "handlers": ["console"],
            "level": "WARNING",
            "propagate": False,
        },
        "engagement_optimization": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "apps.ai": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "apps.simulation": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "apps.reports": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
}

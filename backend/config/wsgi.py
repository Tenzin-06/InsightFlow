import os

from django.core.wsgi import get_wsgi_application

# Override locally: set DJANGO_SETTINGS_MODULE=config.settings.development
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.production")

application = get_wsgi_application()

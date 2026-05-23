from pathlib import Path
from uuid import uuid4

from django.conf import settings


def get_export_asset_dir(report_id: int) -> Path:
    path = Path(settings.MEDIA_ROOT) / "reports" / str(report_id) / "assets"
    path.mkdir(parents=True, exist_ok=True)
    return path


def get_export_dir(report_id: int) -> Path:
    path = Path(settings.MEDIA_ROOT) / "reports" / str(report_id)
    path.mkdir(parents=True, exist_ok=True)
    return path


def build_asset_path(report_id: int, suffix: str) -> Path:
    return get_export_asset_dir(report_id) / f"{uuid4().hex}{suffix}"


def relative_media_path(path: Path) -> str:
    return str(path.relative_to(settings.MEDIA_ROOT)).replace("\\", "/")


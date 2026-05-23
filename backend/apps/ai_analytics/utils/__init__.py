from typing import Any


def success_response(data: Any) -> dict:
    return {"success": True, "data": data, "error": None}


def error_response(message: str, code: str = "AI_ANALYTICS_ERROR") -> dict:
    return {"success": False, "data": None, "error": {"message": message, "code": code}}

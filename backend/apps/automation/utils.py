def success_response(data=None):
    return {"success": True, "data": data or {}, "error": None}


def error_response(message: str, code: str = "AUTOMATION_ERROR"):
    return {
        "success": False,
        "data": None,
        "error": {"code": code, "message": message},
    }


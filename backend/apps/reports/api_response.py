def success_response(data):
    return {"success": True, "data": data, "error": None}


def error_response(message, code="REPORT_ERROR"):
    return {
        "success": False,
        "data": None,
        "error": {"code": code, "message": message},
    }


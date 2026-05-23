def success_response(data: object) -> dict:
    return {"success": True, "data": data, "error": None}


def error_response(message: str, code: str = "SIMULATION_ERROR") -> dict:
    return {"success": False, "data": None, "error": {"code": code, "message": message}}


class SimulationIsolationError(ValueError):
    pass


class SimulationIsolation:
    @staticmethod
    def simulation_tag() -> dict:
        return {"is_simulated": True}

    @staticmethod
    def production_filter() -> dict:
        return {"is_simulated": False}

    @staticmethod
    def tag_metadata(metadata: dict | None) -> dict:
        return {**(metadata or {}), "is_simulated": True, "simulation_context": "isolated"}

    @staticmethod
    def assert_isolated_object(obj, *, label: str) -> None:
        if getattr(obj, "is_simulated", False) is not True:
            raise SimulationIsolationError(f"{label} is not marked as simulation data.")


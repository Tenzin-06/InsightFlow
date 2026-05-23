from apps.simulation.services.simulation_validator import SimulationValidator


def validate_simulation_request(*, payload: dict, owner):
    return SimulationValidator.validate_request(payload=payload, owner=owner)


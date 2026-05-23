class SimulationGuardError(PermissionError):
    pass


class SimulationGuard:
    @staticmethod
    def assert_simulation_context(*, is_simulated: bool, action: str) -> None:
        if not is_simulated:
            raise SimulationGuardError(f"Blocked production action in simulation guard: {action}.")

    @staticmethod
    def block_real_email_sending() -> None:
        raise SimulationGuardError("Simulation Mode cannot send real emails.")

    @staticmethod
    def block_production_campaign_execution() -> None:
        raise SimulationGuardError("Simulation Mode cannot execute production campaigns.")

    @staticmethod
    def block_external_integration() -> None:
        raise SimulationGuardError("Simulation Mode cannot call external integrations.")

    @staticmethod
    def block_analytics_contamination() -> None:
        raise SimulationGuardError("Simulation data cannot be written to production analytics.")

    @classmethod
    def validate_run_safety(cls, simulation_run) -> None:
        cls.assert_simulation_context(
            is_simulated=simulation_run.is_simulated,
            action="simulation_run_execution",
        )
        if simulation_run.allow_external_api:
            cls.block_external_integration()


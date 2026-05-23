from pydantic import BaseModel, ConfigDict, Field


class SimulationRunRequestSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    survey_id: int = Field(gt=0)
    run_name: str = Field(min_length=1, max_length=255)
    requested_responses: int = Field(default=0, ge=0)
    ai_job_limit: int = Field(default=0, ge=0)
    runtime_limit_minutes: int = Field(default=60, gt=0)
    allow_external_api: bool = False
    metadata: dict = Field(default_factory=dict)


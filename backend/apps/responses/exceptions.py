class SubmissionValidationError(Exception):
    """Raised when a survey submission fails business-logic validation."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

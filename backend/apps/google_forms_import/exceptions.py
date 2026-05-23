class GoogleFormsImportError(Exception):
    pass


class InvalidGoogleFormsURLError(GoogleFormsImportError):
    pass


class FormRetrievalError(GoogleFormsImportError):
    pass


class FormParsingError(GoogleFormsImportError):
    pass


class SurveyCreationError(GoogleFormsImportError):
    pass

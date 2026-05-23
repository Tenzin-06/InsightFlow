from django.urls import path

from apps.google_forms_import.views.import_views import GoogleFormsImportView

urlpatterns = [
    path("import/google-forms/", GoogleFormsImportView.as_view(), name="import-google-forms"),
]

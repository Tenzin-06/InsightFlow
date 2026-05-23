from apps.reports.services import process_report_export


def generate_report_export(report_id: int):
    return process_report_export(report_id)


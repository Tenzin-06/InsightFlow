type ReportFooterProps = { pageNumber: number; totalPages: number; generatedDate?: string };

export function ReportFooter({ pageNumber, totalPages, generatedDate }: ReportFooterProps) {
  const timestamp = generatedDate
    ? new Date(generatedDate).toLocaleString()
    : new Date().toLocaleString();
  return (
    <div className="flex items-center justify-between border-t border-border-default pt-3 text-xs text-text-muted">
      <p>Generated: {timestamp}</p>
      <p>
        Page <span className="font-semibold text-text-secondary">{pageNumber}</span> of{" "}
        <span className="font-semibold text-text-secondary">{totalPages}</span>
      </p>
      <p className="font-medium text-primary-400">InsightFlow</p>
    </div>
  );
}

type ReportHeaderProps = { reportTitle: string; sectionTitle: string };

export function ReportHeader({ reportTitle, sectionTitle }: ReportHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border-default pb-3">
      <p className="text-xs font-medium text-text-muted">{reportTitle}</p>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-500">
        {sectionTitle}
      </p>
    </div>
  );
}

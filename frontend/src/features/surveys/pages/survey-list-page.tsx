import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, SlidersHorizontal, ChevronLeft, ChevronRight, FileInput } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageContainer } from "@/components/layout/page-container";
import { SurveyTable } from "@/features/surveys/components/survey-table";
import { useSurveys, useDeleteSurvey, useUpdateSurvey } from "@/features/surveys/hooks/use-surveys";
import { ImportModal } from "@/features/google-forms-import/components/import-modal";

const PAGE_SIZE = 8;

export default function SurveyListPage() {
  const navigate = useNavigate();
  const { data: surveys = [], isLoading, dataUpdatedAt } = useSurveys();
  const deleteSurvey = useDeleteSurvey();
  const updateSurvey = useUpdateSurvey();
  const [importModalOpen, setImportModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return surveys;
    return surveys.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.description ?? "").toLowerCase().includes(q)
    );
  }, [surveys, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Clamp page when filtered results shrink (e.g. after a delete or search change)
  useEffect(() => {
    setPage((p) => Math.min(p, Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))));
  }, [filtered.length]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleDelete(id: string) {
    if (window.confirm("Delete this survey? This action cannot be undone.")) {
      deleteSurvey.mutate(id);
    }
  }

  function handlePublish(id: string) {
    updateSurvey.mutate({ id, payload: { status: "published" } });
  }

  const lastUpdated = dataUpdatedAt
    ? formatRelative(dataUpdatedAt)
    : null;

  return (
    <PageContainer>
      <div className="space-y-5">
        {/* Page header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-text-primary">Surveys Overview</h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              Create, manage, and track all your surveys in one place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setImportModalOpen(true)}
              variant="outline"
              className="shrink-0 gap-2"
            >
              <FileInput className="h-4 w-4" />
              Import Google Form
            </Button>
            <Button
              onClick={() => navigate("/surveys/create")}
              className="shrink-0 gap-2 bg-primary-500 hover:bg-primary-600"
            >
              <Plus className="h-4 w-4" />
              Create New Survey
            </Button>
          </div>
        </div>

        {/* Table with search + filter floated to the top-right */}
        <div className="space-y-3">
          <div className="flex items-center justify-end gap-2">
            <div className="relative w-56">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                placeholder="Search surveys…"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 h-9 text-sm bg-white dark:bg-card"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-1.5 px-3 bg-white hover:bg-slate-50 dark:bg-card">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </Button>
          </div>

        <SurveyTable
          surveys={paginated}
          isLoading={isLoading}
          onDelete={handleDelete}
          onPublish={handlePublish}
          onCreateClick={() => navigate("/surveys/create")}
        />
        </div>

        {/* Footer: last updated + pagination */}
        {!isLoading && (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-muted">
              {lastUpdated ? `Data last updated: ${lastUpdated}` : ""}
              {filtered.length > 0 &&
                ` · Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
            </p>

            {totalPages > 1 && (
              <nav aria-label="Pagination" className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="icon"
                    className={`h-8 w-8 text-xs ${p === page ? "bg-primary-500 hover:bg-primary-600" : ""}`}
                    onClick={() => setPage(p)}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            )}
          </div>
        )}
      </div>
      <ImportModal open={importModalOpen} onOpenChange={setImportModalOpen} />
    </PageContainer>
  );
}

function formatRelative(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
}

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { AudienceFilters } from "@/features/audiences/components/audience-filters";
import { AudienceHeader } from "@/features/audiences/components/audience-header";
import { AudienceTable } from "@/features/audiences/components/audience-table";
import { AudienceEmptyState } from "@/features/audiences/components/empty-state";
import { UploadModal } from "@/features/audiences/components/upload-modal";
import { AUDIENCE_PAGE_SIZE } from "@/features/audiences/constants";
import { useAudiences } from "@/features/audiences/hooks/use-audiences";
import type { Audience, AudienceSortKey } from "@/features/audiences/types";

export default function AudiencesPage() {
  const navigate = useNavigate();
  const { data: audiences = [], isLoading } = useAudiences();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<AudienceSortKey>("created_desc");
  const [page, setPage] = useState(1);
  const [uploadAudienceId, setUploadAudienceId] = useState<string | null>(null);

  const filteredAudiences = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? audiences.filter((audience) =>
          [audience.name, audience.description ?? ""].join(" ").toLowerCase().includes(query)
        )
      : audiences;

    return [...filtered].sort((a, b) => compareAudience(a, b, sort));
  }, [audiences, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredAudiences.length / AUDIENCE_PAGE_SIZE));
  const paginatedAudiences = filteredAudiences.slice(
    (page - 1) * AUDIENCE_PAGE_SIZE,
    page * AUDIENCE_PAGE_SIZE
  );

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <PageContainer>
      <div className="space-y-5">
        <AudienceHeader
          title="Audiences"
          description="Organize recipient groups for survey distribution and campaign targeting."
        />

        <div className="space-y-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Button
              onClick={() => navigate("/dashboard/audiences/new")}
              className="w-full bg-primary-500 hover:bg-primary-600 sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              Create audience
            </Button>
            <AudienceFilters
              search={search}
              sort={sort}
              onSearchChange={handleSearchChange}
              onSortChange={setSort}
            />
          </div>

          {!isLoading && audiences.length === 0 ? (
            <AudienceEmptyState
              icon={Users}
              title="Create your first audience"
              description="Start with a named audience, then upload contacts by CSV when you are ready."
              actionLabel="Create audience"
              onAction={() => navigate("/dashboard/audiences/new")}
            />
          ) : !isLoading && filteredAudiences.length === 0 ? (
            <AudienceEmptyState
              icon={Users}
              title="No audiences match your search"
              description="Try searching by another audience name or description."
            />
          ) : (
            <AudienceTable
              audiences={paginatedAudiences}
              isLoading={isLoading}
              onOpen={(id) => navigate(`/dashboard/audiences/${id}`)}
              onEdit={(id) => navigate(`/dashboard/audiences/${id}/edit`)}
              onUpload={(id) => setUploadAudienceId(id)}
            />
          )}
        </div>

        {!isLoading && filteredAudiences.length > 0 && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-muted">
              Showing {(page - 1) * AUDIENCE_PAGE_SIZE + 1}-
              {Math.min(page * AUDIENCE_PAGE_SIZE, filteredAudiences.length)} of{" "}
              {filteredAudiences.length}
            </p>
            {totalPages > 1 && (
              <nav className="flex items-center gap-1" aria-label="Audience pagination">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
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

      {uploadAudienceId && (
        <UploadModal
          audienceId={uploadAudienceId}
          open={Boolean(uploadAudienceId)}
          onOpenChange={(open) => {
            if (!open) setUploadAudienceId(null);
          }}
        />
      )}
    </PageContainer>
  );
}

function compareAudience(a: Audience, b: Audience, sort: AudienceSortKey): number {
  if (sort === "created_asc") return dateValue(a.created_at) - dateValue(b.created_at);
  if (sort === "contacts_desc") return b.recipient_count - a.recipient_count;
  if (sort === "contacts_asc") return a.recipient_count - b.recipient_count;
  return dateValue(b.created_at) - dateValue(a.created_at);
}

function dateValue(value: string): number {
  return new Date(value).getTime();
}

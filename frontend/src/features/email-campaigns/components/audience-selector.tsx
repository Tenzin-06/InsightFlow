import { UsersRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/features/email-campaigns/components/empty-state";
import { useAudienceSelection } from "@/features/email-campaigns/hooks/use-audience-selection";
import { formatAudienceDate } from "@/features/email-campaigns/utils/preview-utils";
import type { Audience } from "@/features/audiences/types";

export function AudienceSelector({
  audiences,
  selectedIds,
  error,
  onChange,
}: {
  audiences: Audience[];
  selectedIds: string[];
  error?: string;
  onChange: (ids: string[]) => void;
}) {
  const { query, setQuery, filteredAudiences, toggleAudience } = useAudienceSelection(audiences, selectedIds, onChange);

  return (
    <Card id="audience-selection">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UsersRound className="h-4 w-4 text-primary-600" />
          Audience Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {audiences.length === 0 ? (
          <EmptyState
            title="Create an audience to begin campaign distribution"
            description="Audience lists from Unit 21 will appear here when available."
          />
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="audience-search">Search audiences</Label>
              <Input
                id="audience-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by audience name"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {filteredAudiences.map((audience) => {
                const id = String(audience.id);
                const selected = selectedIds.includes(id);

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleAudience(id)}
                    className="rounded-xl border border-border bg-bg-secondary p-4 text-left transition hover:border-primary-300 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 data-[selected=true]:border-primary-500 data-[selected=true]:bg-primary-50"
                    data-selected={selected}
                    aria-pressed={selected}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox checked={selected} aria-hidden="true" tabIndex={-1} className="mt-1" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-text-primary">{audience.name}</div>
                        <div className="mt-1 text-xs text-text-secondary">
                          {audience.recipient_count} recipients · Created {formatAudienceDate(audience.created_at)}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </CardContent>
    </Card>
  );
}

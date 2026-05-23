import { CalendarDays, Users } from "lucide-react";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AudienceActions } from "@/features/audiences/components/audience-actions";
import type { Audience } from "@/features/audiences/types";

type Props = {
  audience: Audience;
  onOpen: () => void;
  onEdit: () => void;
  onUpload: () => void;
  onDelete: () => void;
};

export function AudienceCard({ audience, onOpen, onEdit, onUpload, onDelete }: Props) {
  return (
    <Card className="bg-white shadow-sm dark:bg-card">
      <CardHeader>
        <CardTitle className="line-clamp-1 text-text-primary">{audience.name}</CardTitle>
        <CardAction>
          <AudienceActions onOpen={onOpen} onEdit={onEdit} onUpload={onUpload} onDelete={onDelete} />
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-2 min-h-10 text-sm text-text-secondary">
          {audience.description || "No description provided."}
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-bg-tertiary p-3">
            <div className="flex items-center gap-2 text-text-muted">
              <Users className="h-4 w-4" />
              Contacts
            </div>
            <p className="mt-1 font-semibold text-text-primary">{audience.recipient_count}</p>
          </div>
          <div className="rounded-lg bg-bg-tertiary p-3">
            <div className="flex items-center gap-2 text-text-muted">
              <CalendarDays className="h-4 w-4" />
              Created
            </div>
            <p className="mt-1 font-semibold text-text-primary">{formatDate(audience.created_at)}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full bg-white dark:bg-card" onClick={onOpen}>
          Manage audience
        </Button>
      </CardContent>
    </Card>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value)
  );
}

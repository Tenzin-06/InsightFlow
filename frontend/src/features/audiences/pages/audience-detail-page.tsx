import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Trash2, Upload, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageContainer } from "@/components/layout/page-container";
import { AudienceHeader } from "@/features/audiences/components/audience-header";
import { ContactTable } from "@/features/audiences/components/contact-table";
import { UploadModal } from "@/features/audiences/components/upload-modal";
import { useAudienceDetail } from "@/features/audiences/hooks/use-audience-detail";
import { useAudienceContacts } from "@/features/audiences/hooks/use-audience-contacts";
import { useDeleteAudience } from "@/features/audiences/hooks/use-delete-audience";

export default function AudienceDetailPage() {
  const { audienceId } = useParams();
  const navigate = useNavigate();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Audience metadata (name, description, recipient_count, etc.)
  const { data: audience, isLoading, isError } = useAudienceDetail(audienceId);

  // Contacts from the dedicated /audiences/:id/recipients/ endpoint
  const { data: recipientPage, isLoading: contactsLoading } = useAudienceContacts({
    audienceId,
    limit: 200, // generous first page — ContactTable handles client-side search
  });
  const contacts = recipientPage?.results ?? [];

  // Delete audience mutation (redirects to /dashboard/audiences on success)
  const deleteMutation = useDeleteAudience({ redirectOnSuccess: "/dashboard/audiences" });

  // ------------------------------------------------------------------ loading

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-5">
          <Skeleton className="h-24 rounded-xl" />
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </PageContainer>
    );
  }

  if (isError || !audience || !audienceId) {
    return (
      <PageContainer>
        <AudienceHeader title="Audience not found" onBack={() => navigate("/dashboard/audiences")} />
      </PageContainer>
    );
  }

  // ------------------------------------------------------------------ render

  return (
    <PageContainer>
      <div className="space-y-5">
        {/* Page header + actions row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <AudienceHeader
            title={audience.name}
            description={audience.description}
            contactCount={audience.recipient_count}
            onBack={() => navigate("/dashboard/audiences")}
            onUpload={() => setUploadOpen(true)}
          />
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 self-start border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={Users} label="Total contacts" value={audience.recipient_count} />
          <StatCard
            icon={Upload}
            label="Loaded contacts"
            value={contactsLoading ? "…" : contacts.length}
          />
          <StatCard icon={Clock} label="Created" value={formatDate(audience.created_at)} />
        </div>

        {/* Contact table (handles its own search state) */}
        <ContactTable contacts={contacts} onUpload={() => setUploadOpen(true)} />
      </div>

      {/* Upload modal */}
      <UploadModal audienceId={audienceId} open={uploadOpen} onOpenChange={setUploadOpen} />

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete audience</DialogTitle>
            <DialogDescription>
              This action permanently deletes the audience and all contacts. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteOpen(false);
                deleteMutation.mutate(audienceId);
              }}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete audience"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}

// ------------------------------------------------------------------ helpers

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="bg-white shadow-sm dark:bg-card">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-sm text-text-secondary">
          <Icon className="h-4 w-4 text-primary-500" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-text-primary">{value}</p>
      </CardContent>
    </Card>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

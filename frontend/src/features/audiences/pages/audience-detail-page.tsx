import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, Upload, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { AudienceHeader } from "@/features/audiences/components/audience-header";
import { ContactTable } from "@/features/audiences/components/contact-table";
import { UploadModal } from "@/features/audiences/components/upload-modal";
import { useAudienceDetail } from "@/features/audiences/hooks/use-audience-detail";

export default function AudienceDetailPage() {
  const { audienceId } = useParams();
  const navigate = useNavigate();
  const [uploadOpen, setUploadOpen] = useState(false);
  const { data: audience, isLoading, isError } = useAudienceDetail(audienceId);

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

  const contacts = audience.recipients ?? [];

  return (
    <PageContainer>
      <div className="space-y-5">
        <AudienceHeader
          title={audience.name}
          description={audience.description}
          contactCount={audience.recipient_count}
          onBack={() => navigate("/dashboard/audiences")}
          onUpload={() => setUploadOpen(true)}
        />

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={Users} label="Total contacts" value={audience.recipient_count} />
          <StatCard icon={Upload} label="Recently added" value={contacts.length} />
          <StatCard icon={Clock} label="Created" value={formatDate(audience.created_at)} />
        </div>

        <ContactTable contacts={contacts} onUpload={() => setUploadOpen(true)} />
      </div>

      <UploadModal audienceId={audienceId} open={uploadOpen} onOpenChange={setUploadOpen} />
    </PageContainer>
  );
}

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
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value)
  );
}

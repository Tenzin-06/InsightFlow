import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { AudienceForm } from "@/features/audiences/components/audience-form";
import { AudienceHeader } from "@/features/audiences/components/audience-header";
import { useAudienceDetail } from "@/features/audiences/hooks/use-audience-detail";
import { useCreateAudience, useUpdateAudience } from "@/features/audiences/hooks/use-audiences";
import type { CreateAudiencePayload } from "@/features/audiences/types";

type Props = {
  mode: "create" | "edit";
};

export default function AudienceFormPage({ mode }: Props) {
  const { audienceId } = useParams();
  const navigate = useNavigate();
  const createAudience = useCreateAudience();
  const updateAudience = useUpdateAudience();
  const { data: audience, isLoading } = useAudienceDetail(mode === "edit" ? audienceId : undefined);

  useEffect(() => {
    if (createAudience.isSuccess) navigate("/dashboard/audiences");
  }, [createAudience.isSuccess, navigate]);

  useEffect(() => {
    if (updateAudience.isSuccess && audienceId) navigate(`/dashboard/audiences/${audienceId}`);
  }, [audienceId, navigate, updateAudience.isSuccess]);

  function handleSubmit(payload: CreateAudiencePayload) {
    if (mode === "edit" && audienceId) {
      updateAudience.mutate({ id: audienceId, payload });
      return;
    }
    createAudience.mutate(payload);
  }

  const isSaving = createAudience.isPending || updateAudience.isPending;

  return (
    <PageContainer>
      <div className="max-w-2xl space-y-5">
        <AudienceHeader
          title={mode === "edit" ? "Edit audience" : "Create audience"}
          description="Use a clear name so it is easy to attach this audience to future campaigns."
          onBack={() =>
            mode === "edit" && audienceId
              ? navigate(`/dashboard/audiences/${audienceId}`)
              : navigate("/dashboard/audiences")
          }
        />

        <Card className="bg-white shadow-sm dark:bg-card">
          <CardHeader>
            <CardTitle>{mode === "edit" ? "Audience details" : "New audience"}</CardTitle>
          </CardHeader>
          <CardContent>
            {mode === "edit" && isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 rounded-md" />
                <Skeleton className="h-28 rounded-md" />
                <Skeleton className="h-10 w-36 rounded-md" />
              </div>
            ) : (
              <AudienceForm
                onSubmit={handleSubmit}
                isLoading={isSaving}
                submitLabel={mode === "edit" ? "Save audience" : "Create audience"}
                defaultValues={{
                  name: audience?.name,
                  description: audience?.description ?? "",
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

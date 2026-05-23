import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateAudiencePayload } from "@/features/audiences/types";

const audienceSchema = z.object({
  name: z.string().min(1, "Name is required").max(160, "Name must be under 160 characters"),
  description: z.string().max(600, "Description must be under 600 characters").optional(),
});

type FormValues = z.infer<typeof audienceSchema>;

type Props = {
  onSubmit: (payload: CreateAudiencePayload) => void;
  isLoading?: boolean;
  submitLabel?: string;
  defaultValues?: Partial<FormValues>;
};

export function AudienceForm({
  onSubmit,
  isLoading,
  submitLabel = "Create audience",
  defaultValues,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(audienceSchema),
    defaultValues,
  });

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="audience-name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="audience-name"
          placeholder="e.g. Spring field study participants"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="audience-description">Description</Label>
        <Textarea
          id="audience-description"
          rows={4}
          placeholder="Add a short note about who belongs in this audience."
          aria-invalid={!!errors.description}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive" role="alert">
            {errors.description.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="bg-primary-500 hover:bg-primary-600">
        {isLoading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}

import { Skeleton } from "@/components/ui/skeleton";
import { AudienceCard } from "@/features/audiences/components/audience-card";
import type { Audience } from "@/features/audiences/types";

type Props = {
  audiences: Audience[];
  isLoading?: boolean;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onUpload: (id: string) => void;
};

export function AudienceTable({ audiences, isLoading, onOpen, onEdit, onUpload }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-56 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {audiences.map((audience) => (
        <AudienceCard
          key={audience.id}
          audience={audience}
          onOpen={() => onOpen(audience.id)}
          onEdit={() => onEdit(audience.id)}
          onUpload={() => onUpload(audience.id)}
        />
      ))}
    </div>
  );
}

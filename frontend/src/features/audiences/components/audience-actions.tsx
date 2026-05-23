import { MoreHorizontal, Pencil, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  onOpen: () => void;
  onEdit: () => void;
  onUpload: () => void;
};

export function AudienceActions({ onOpen, onEdit, onUpload }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Audience actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onOpen}>
          <Users className="mr-2 h-4 w-4" />
          View contacts
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onUpload}>
          <Upload className="mr-2 h-4 w-4" />
          Upload CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit audience
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

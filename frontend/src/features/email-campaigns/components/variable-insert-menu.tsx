import { Braces } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PERSONALIZATION_VARIABLES } from "@/features/email-campaigns/constants";
import type { PersonalizationVariable } from "@/features/email-campaigns/types";
import { formatVariable } from "@/features/email-campaigns/utils/variable-utils";

export function VariableInsertMenu({
  onInsert,
  size = "sm",
}: {
  onInsert: (variable: PersonalizationVariable) => void;
  size?: "sm" | "default";
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={size} aria-label="Insert personalization variable">
          <Braces className="h-4 w-4" />
          Variables
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Personalization</DropdownMenuLabel>
        {PERSONALIZATION_VARIABLES.map((variable) => (
          <DropdownMenuItem key={variable.key} onSelect={() => onInsert(variable)} className="flex-col items-start gap-1">
            <span className="text-sm font-medium">{variable.label}</span>
            <span className="font-mono text-xs text-text-muted">{formatVariable(variable.key)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

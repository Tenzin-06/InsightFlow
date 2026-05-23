import { AlertTriangle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SimulationWarningProps = {
  title?: string;
  description: string;
};

export function SimulationWarning({ title = "Synthetic Data Notice", description }: SimulationWarningProps) {
  return (
    <Alert className="border-orange-300 bg-orange-50 text-orange-900 [&>svg]:text-orange-700">
      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}


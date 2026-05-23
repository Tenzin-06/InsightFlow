import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isSubmitting: boolean;
}

/**
 * Submit button with loading and disabled states.
 * Prevents duplicate submissions via disabled prop during mutation.
 */
export function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={isSubmitting}
      className="w-full gap-2 text-base font-semibold"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Submitting Survey…
        </>
      ) : (
        <>
          <Send className="h-4 w-4" aria-hidden="true" />
          Submit Survey
        </>
      )}
    </Button>
  );
}

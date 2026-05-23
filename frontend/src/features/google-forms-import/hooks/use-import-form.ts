import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isGoogleFormsUrl } from "@/features/google-forms-import/utils";
import type { ImportFormValues } from "@/features/google-forms-import/types";

const schema = z.object({
  url: z
    .string()
    .min(1, "Please enter a Google Forms URL.")
    .refine((val) => isGoogleFormsUrl(val), {
      message:
        "Must be a valid Google Forms URL (https://docs.google.com/forms/…)",
    }),
});

export type ImportFormSchema = z.infer<typeof schema>;

export function useImportForm() {
  const form = useForm<ImportFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { url: "" },
    mode: "onChange",
  });

  return form;
}

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Question, QuestionType, CreateQuestionPayload } from "@/features/surveys/types";

const questionSchema = z.object({
  question_text: z.string().min(1, "Question text is required"),
  question_type: z.enum([
    "short_text",
    "long_text",
    "multiple_choice",
    "checkbox",
    "rating",
  ] as const),
  is_required: z.boolean(),
});

type FormValues = z.infer<typeof questionSchema>;

const questionTypeOptions: { value: QuestionType; label: string }[] = [
  { value: "short_text", label: "Short Text" },
  { value: "long_text", label: "Long Text" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "checkbox", label: "Checkbox" },
  { value: "rating", label: "Rating" },
];

type Props = {
  question?: Question;
  onSubmit: (data: CreateQuestionPayload) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function QuestionEditor({ question, onSubmit, onCancel, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question_text: question?.question_text ?? "",
      question_type: question?.question_type ?? "short_text",
      is_required: question?.is_required ?? false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="question_text">
          Question Text <span className="text-destructive">*</span>
        </Label>
        <Input
          id="question_text"
          placeholder="e.g. How satisfied are you with our service?"
          aria-invalid={!!errors.question_text}
          {...register("question_text")}
        />
        {errors.question_text && (
          <p className="text-xs text-destructive" role="alert">
            {errors.question_text.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="question_type">Question Type</Label>
        <Controller
          name="question_type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="question_type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {questionTypeOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_required"
          className="h-4 w-4 rounded border-input accent-primary-500"
          {...register("is_required")}
        />
        <Label htmlFor="is_required" className="cursor-pointer font-normal">
          Required question
        </Label>
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-primary-500 hover:bg-primary-600"
        >
          {isLoading ? "Saving…" : question ? "Save Changes" : "Add Question"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

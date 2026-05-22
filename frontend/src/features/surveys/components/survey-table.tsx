import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Pencil, Eye, Trash2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SurveyStatusBadge } from "./survey-status-badge";
import { EmptyState } from "./empty-state";
import type { Survey } from "@/features/surveys/types";

type Props = {
  surveys: Survey[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onCreateClick: () => void;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pl-4 pr-3">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
        </div>
      </td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-16" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
      <td className="px-4 py-3"><Skeleton className="h-5 w-20 rounded-full" /></td>
      <td className="py-3 pl-3 pr-4"><Skeleton className="h-7 w-7 rounded-md" /></td>
    </tr>
  );
}

export function SurveyTable({ surveys, isLoading, onDelete, onPublish, onCreateClick }: Props) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/25 dark:bg-card dark:ring-white/[0.08]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/25 bg-black/[0.06] dark:border-white/[0.08] dark:bg-muted/40">
              <th className="py-3 pl-4 pr-3 text-left text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-text-primary">
                Survey Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-text-primary">
                Responses
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-text-primary">
                Completion Rate
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-text-primary">
                Last Updated
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-gray-900 dark:text-text-primary">
                Status
              </th>
              <th className="py-3 pl-3 pr-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : surveys.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    title="No surveys yet"
                    description="Create your first survey to start collecting responses and generating insights."
                    actionLabel="Create New Survey"
                    onAction={onCreateClick}
                  />
                </td>
              </tr>
            ) : (
              surveys.map((survey) => (
                <tr
                  key={survey.id}
                  className="border-b border-gray-100 last:border-0 transition-colors hover:bg-gray-50/70 dark:border-white/[0.05] dark:hover:bg-muted/20"
                >
                  {/* Survey Name */}
                  <td className="py-3.5 pl-4 pr-3">
                    <button
                      onClick={() => navigate(`/surveys/${survey.id}`)}
                      className="text-left"
                    >
                      <p className="font-semibold text-gray-900 transition-colors hover:text-indigo-600 dark:text-text-primary">
                        {survey.title}
                      </p>
                      {survey.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">
                          {survey.description}
                        </p>
                      )}
                    </button>
                  </td>

                  {/* Responses */}
                  <td className="px-4 py-3.5 text-gray-500 dark:text-text-secondary">
                    {survey.response_count != null
                      ? `${survey.response_count} response${survey.response_count !== 1 ? "s" : ""}`
                      : <span className="text-gray-300 dark:text-text-muted">—</span>}
                  </td>

                  {/* Completion Rate */}
                  <td className="px-4 py-3.5">
                    {survey.completion_rate != null ? (
                      <span className="text-gray-700 dark:text-text-primary">
                        {survey.completion_rate.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-gray-300 dark:text-text-muted">—</span>
                    )}
                  </td>

                  {/* Last Updated */}
                  <td className="px-4 py-3.5 text-gray-500 dark:text-text-secondary">
                    {formatDate(survey.updated_at)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <SurveyStatusBadge status={survey.status} />
                  </td>

                  {/* Actions — always visible */}
                  <td className="py-3.5 pl-3 pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-gray-400 hover:text-gray-600"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Row actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-black/25">
                        <DropdownMenuItem onClick={() => navigate(`/surveys/${survey.id}/edit`)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/surveys/${survey.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        {survey.status === "draft" && (
                          <DropdownMenuItem onClick={() => onPublish(survey.id)}>
                            <Globe className="mr-2 h-4 w-4" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(survey.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

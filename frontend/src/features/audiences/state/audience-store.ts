/**
 * audience-store.ts
 *
 * Centralized ephemeral UI state for the audience management feature.
 * Uses React's built-in useState via a simple module-level signal pattern
 * (no Zustand dependency) — suitable for the MVP audience workflow.
 *
 * Persistent server state is managed by TanStack Query in the hooks layer.
 */

import { useState, useCallback } from "react";
import type { ContactUploadDraft } from "@/features/audiences/types";

/** UI state for the upload workflow. */
export type UploadState = {
  draft: ContactUploadDraft | null;
  isParsing: boolean;
  isOpen: boolean;
};

const INITIAL_UPLOAD_STATE: UploadState = {
  draft: null,
  isParsing: false,
  isOpen: false,
};

/**
 * Hook that provides isolated upload modal state.
 * Each component that calls this gets its own local state — suitable for
 * the single-audience-detail-page upload flow.
 *
 * For shared state across a subtree, lift this into a context provider.
 */
export function useUploadState() {
  const [state, setState] = useState<UploadState>(INITIAL_UPLOAD_STATE);

  const openUpload = useCallback(() =>
    setState((s) => ({ ...s, isOpen: true })), []);

  const closeUpload = useCallback(() =>
    setState(INITIAL_UPLOAD_STATE), []);

  const setDraft = useCallback((draft: ContactUploadDraft | null) =>
    setState((s) => ({ ...s, draft })), []);

  const setIsParsing = useCallback((isParsing: boolean) =>
    setState((s) => ({ ...s, isParsing })), []);

  const resetDraft = useCallback(() =>
    setState((s) => ({ ...s, draft: null, isParsing: false })), []);

  return {
    ...state,
    openUpload,
    closeUpload,
    setDraft,
    setIsParsing,
    resetDraft,
  };
}

/** UI state for the audience list page (search + sort). */
export type AudienceListState = {
  search: string;
  sortKey: string;
  page: number;
};

const INITIAL_LIST_STATE: AudienceListState = {
  search: "",
  sortKey: "created_desc",
  page: 1,
};

/**
 * Hook that provides audience list page UI state.
 */
export function useAudienceListState() {
  const [state, setState] = useState<AudienceListState>(INITIAL_LIST_STATE);

  const setSearch = useCallback((search: string) =>
    setState((s) => ({ ...s, search, page: 1 })), []);

  const setSortKey = useCallback((sortKey: string) =>
    setState((s) => ({ ...s, sortKey, page: 1 })), []);

  const setPage = useCallback((page: number) =>
    setState((s) => ({ ...s, page })), []);

  const reset = useCallback(() => setState(INITIAL_LIST_STATE), []);

  return { ...state, setSearch, setSortKey, setPage, reset };
}

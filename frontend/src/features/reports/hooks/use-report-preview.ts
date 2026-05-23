import { useState, useCallback } from "react";
import type { ReportConfig, ReportPreviewState } from "../types";
import { DEFAULT_ZOOM, ZOOM_LEVELS } from "../constants";

export function useReportPreview(config: ReportConfig) {
  const [preview, setPreview] = useState<ReportPreviewState>({
    isVisible: false,
    currentPage: 1,
    totalPages: config.sections.length,
    zoom: DEFAULT_ZOOM,
  });

  const openPreview = useCallback(() => {
    setPreview((prev) => ({
      ...prev,
      isVisible: true,
      currentPage: 1,
      totalPages: config.sections.length,
    }));
  }, [config.sections.length]);

  const closePreview = useCallback(() => {
    setPreview((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setPreview((prev) => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages)),
    }));
  }, []);

  const nextPage = useCallback(() => {
    setPreview((prev) => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.totalPages),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setPreview((prev) => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1),
    }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setPreview((prev) => ({ ...prev, zoom }));
  }, []);

  const zoomIn = useCallback(() => {
    setPreview((prev) => {
      const idx = ZOOM_LEVELS.indexOf(prev.zoom as (typeof ZOOM_LEVELS)[number]);
      const next = idx < ZOOM_LEVELS.length - 1 ? ZOOM_LEVELS[idx + 1] : prev.zoom;
      return { ...prev, zoom: next };
    });
  }, []);

  const zoomOut = useCallback(() => {
    setPreview((prev) => {
      const idx = ZOOM_LEVELS.indexOf(prev.zoom as (typeof ZOOM_LEVELS)[number]);
      const next = idx > 0 ? ZOOM_LEVELS[idx - 1] : prev.zoom;
      return { ...prev, zoom: next };
    });
  }, []);

  return { preview, openPreview, closePreview, goToPage, nextPage, prevPage, setZoom, zoomIn, zoomOut };
}

import { useMemo } from "react";
import { generateSurveyShareLink, generateConversationalShareLink } from "../utils/url-builder";

export function useShareLink(slug: string | null | undefined) {
  const standardLink = useMemo(
    () => (slug ? generateSurveyShareLink(slug) : ""),
    [slug]
  );
  const conversationalLink = useMemo(
    () => (slug ? generateConversationalShareLink(slug) : ""),
    [slug]
  );
  return { standardLink, conversationalLink };
}

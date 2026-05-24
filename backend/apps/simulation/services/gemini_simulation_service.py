"""
GeminiSimulationService — generates authentic synthetic survey responses using Gemini AI.

For each persona, it builds a rich prompt containing:
  - The persona profile (age range, occupation, education, region, traits)
  - All survey questions with their types and options
  - Instructions to respond authentically as that persona

Gemini returns a structured JSON object with per-question answers. Results are
stored in SyntheticDataset.metadata["responses"] for later retrieval.
"""

import json
import logging
from typing import Any

logger = logging.getLogger("apps.simulation")


class GeminiSimulationService:
    @staticmethod
    def _build_persona_description(persona: dict) -> str:
        meta = persona.get("metadata", {})
        name = persona.get("name", "Anonymous")

        lines = [
            f"Name: {name}",
            f"Age range: {persona.get('age_range', 'unknown')}",
            f"Occupation: {persona.get('occupation', 'unknown')}",
            f"Education: {persona.get('education', 'unknown')}",
            f"Region: {persona.get('region', 'unknown')}",
            f"Communication style: {meta.get('communication_style', 'neutral')}",
            f"Response tone: {meta.get('response_tone', 'balanced')}",
            f"Engagement level: {meta.get('engagement_level', 'medium')}",
            f"Response depth: {meta.get('response_depth', 'moderate')}",
            f"Technology familiarity: {meta.get('technology_familiarity', 'medium')}",
        ]

        prohibited = persona.get("prohibited_traits", [])
        if prohibited:
            lines.append(f"Prohibited behaviors / traits to avoid: {', '.join(str(t) for t in prohibited)}")

        return "\n".join(lines)

    @staticmethod
    def _build_questions_text(questions: list) -> str:
        if not questions:
            return ""

        parts = []
        for i, q in enumerate(questions, 1):
            qtype = q.question_type
            choices = q.metadata.get("choices", [])
            line = f"{i}. [ID:{q.pk}] [{qtype}] {q.question_text}"

            if qtype in ("multiple_choice", "checkbox") and choices:
                line += f"\n   Options: {', '.join(str(c) for c in choices)}"
            elif qtype == "rating":
                min_val = q.metadata.get("min_value", 1)
                max_val = q.metadata.get("max_value", 5)
                line += f"\n   Scale: {min_val}–{max_val} (integer only)"

            parts.append(line)

        return "\n".join(parts)

    @staticmethod
    def _parse_gemini_response(raw: str, persona_name: str) -> list[dict]:
        """Strip markdown fences and parse JSON from Gemini response."""
        raw = raw.strip()

        # Strip ```json ... ``` or ``` ... ``` fences if present
        if raw.startswith("```"):
            lines = raw.split("\n")
            # Remove first line (```json or ```) and last ``` line
            inner = "\n".join(lines[1:])
            if inner.rstrip().endswith("```"):
                inner = inner.rstrip()[:-3].rstrip()
            raw = inner

        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError as exc:
            logger.warning(
                "GeminiSimulationService: JSON parse error for persona '%s': %s — raw=%s",
                persona_name,
                exc,
                raw[:200],
            )
            return []

        responses = parsed.get("responses", [])
        if not isinstance(responses, list):
            return []

        return responses

    @staticmethod
    def generate_responses_for_persona(questions: list, persona: dict) -> list[dict]:
        """
        Call Gemini to generate survey responses for a single persona.

        Returns a list of response dicts, each with:
          { question_id, question, answer, confidence }
        """
        from apps.ai.services.gemini_service import GeminiService

        persona_desc = GeminiSimulationService._build_persona_description(persona)
        questions_text = GeminiSimulationService._build_questions_text(questions)

        if not questions_text:
            return []

        persona_name = persona.get("name", "Unknown")

        prompt = f"""You are simulating a realistic survey respondent with the following profile:

{persona_desc}

Answer each survey question authentically as this persona. Follow these rules strictly:
- For multiple_choice: choose EXACTLY ONE option from the provided list — copy it verbatim
- For checkbox: choose ONE OR MORE options from the provided list — copy them verbatim, separated by ", "
- For rating: respond with a single integer within the stated scale
- For short_text: write 1–2 sentences in the persona's voice and communication style
- For long_text: write 2–4 sentences with appropriate depth for this persona
- Reflect the persona's engagement level, tone, and communication style throughout
- Do NOT break the prohibited behaviors listed above

Survey Questions:
{questions_text}

Respond ONLY with valid JSON (no markdown, no explanation, no code fences):
{{"responses": [{{"question_id": <integer>, "question": "<full question text>", "answer": "<your answer>", "confidence": <float 0.0–1.0>}}]}}

Include one entry per question, in order."""

        service = GeminiService()
        try:
            result = service.generate_structured_output(prompt)
            raw = result.get("text", "")
        except Exception as exc:
            logger.warning(
                "GeminiSimulationService: Gemini call failed for persona '%s': %s",
                persona_name,
                exc,
            )
            return []

        return GeminiSimulationService._parse_gemini_response(raw, persona_name)

    @staticmethod
    def generate_all_responses(simulation_run) -> list[dict]:
        """
        Generate AI responses for every persona embedded in the simulation run metadata.

        Returns a list, one entry per persona:
          { persona_id, persona_name, responses: [...] }
        """
        from apps.surveys.models.question import Question

        questions = list(
            Question.objects.filter(survey=simulation_run.survey).order_by("order")
        )
        if not questions:
            logger.warning(
                "GeminiSimulationService: survey %s has no questions — skipping generation",
                simulation_run.survey_id,
            )
            return []

        personas = simulation_run.metadata.get("personas", [])
        if not personas:
            logger.warning(
                "GeminiSimulationService: simulation run %s has no personas in metadata — "
                "ensure the frontend passes full persona objects under metadata.personas",
                simulation_run.pk,
            )
            return []

        logger.info(
            "GeminiSimulationService: generating responses for %d persona(s), %d question(s) — run=%s",
            len(personas),
            len(questions),
            simulation_run.pk,
        )

        all_results = []
        for persona in personas:
            persona_name = persona.get("name", "Unknown Persona")
            try:
                responses = GeminiSimulationService.generate_responses_for_persona(
                    questions, persona
                )
            except Exception as exc:
                logger.error(
                    "GeminiSimulationService: unexpected error for persona '%s': %s",
                    persona_name,
                    exc,
                )
                responses = []

            all_results.append(
                {
                    "persona_id": persona.get("id", "unknown"),
                    "persona_name": persona_name,
                    "responses": responses,
                }
            )

        return all_results

import logging

import requests

from apps.google_forms_import.constants import MAX_RESPONSE_SIZE_BYTES, REQUEST_TIMEOUT_SECONDS
from apps.google_forms_import.exceptions import FormParsingError, FormRetrievalError
from apps.google_forms_import.types import RawForm, RawQuestion
from apps.google_forms_import.utils.html_parser import extract_form_data

logger = logging.getLogger(__name__)

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Sec-Fetch-Mode": "navigate",
}

# ── Google Forms item[3] → InsightFlow question type ─────────────────────────
#
# The question TYPE is encoded at the ITEM level (item[3]), NOT inside entry[7].
# Confirmed from live FB_PUBLIC_LOAD_DATA_ diagnostic (May 2026):
#
#   item[3] == 0  →  short answer    → short_text
#   item[3] == 1  →  paragraph       → long_text
#   item[3] == 2  →  multiple choice → multiple_choice
#   item[3] == 3  →  dropdown        → multiple_choice  (closest match)
#   item[3] == 4  →  checkboxes      → checkbox
#   item[3] == 5  →  linear scale    → rating
#
# item[3] == 6 (MC grid), 7 (CB grid), 8 (date), 9 (time) → not supported → skipped.

_ITEM_TYPE_TO_IF: dict[int, str] = {
    0: "short_text",
    1: "long_text",
    2: "multiple_choice",
    3: "multiple_choice",   # dropdown — best approximation
    4: "checkbox",
    5: "rating",
}

# ── Entry structure (item[4][0]) ──────────────────────────────────────────────
#
# entry[0]  = form field ID (int)
# entry[1]  = options list  (list of [option_text, ...] sub-lists) — or None
# entry[2]  = required flag (1 = required, 0 = optional)
# entry[3]  = for linear scale: [min_label, max_label]  — otherwise None
#
# entry[7] is None in all current Google Forms responses; do NOT use it.


def fetch_form_html(url: str) -> str:
    try:
        response = requests.get(
            url,
            headers=_HEADERS,
            timeout=REQUEST_TIMEOUT_SECONDS,
            stream=True,
            allow_redirects=True,
        )
        response.raise_for_status()
    except requests.exceptions.Timeout:
        raise FormRetrievalError("Request timed out while retrieving Google Form.")
    except requests.exceptions.ConnectionError:
        raise FormRetrievalError("Unable to connect to Google Forms. Check network connectivity.")
    except requests.exceptions.HTTPError as exc:
        code = exc.response.status_code if exc.response is not None else "unknown"
        raise FormRetrievalError(f"Google Forms returned HTTP {code}.")
    except requests.exceptions.RequestException as exc:
        raise FormRetrievalError(f"Unable to retrieve Google Form: {exc}")

    content = b""
    for chunk in response.iter_content(chunk_size=8192):
        content += chunk
        if len(content) > MAX_RESPONSE_SIZE_BYTES:
            raise FormRetrievalError("Google Form response exceeds the allowed size limit.")

    return content.decode("utf-8", errors="replace")


def _extract_options(entry: list) -> list[str]:
    """
    Extract choice option texts from entry[1].

    Google Forms encodes choices as:
      [[option_text, None, None, None, 0], ...]

    The option text is the first string element in each sub-list.
    """
    options: list[str] = []
    try:
        raw_options = entry[1]
        if not isinstance(raw_options, list):
            return options
        for opt in raw_options:
            if not isinstance(opt, list) or not opt:
                continue
            # Find the first non-empty string element (option text)
            for elem in opt:
                if isinstance(elem, str) and elem.strip():
                    options.append(elem.strip())
                    break
    except (IndexError, TypeError):
        pass
    return options


def _parse_question_item(item: list) -> RawQuestion | None:
    """
    Parse a single Google Forms item list into a RawQuestion.

    Key insight from live data: the question type lives at item[3] (item level),
    not inside the entry sub-list.
    """
    try:
        # ── 1. Title ─────────────────────────────────────────────────────
        title = item[1] if len(item) > 1 else None
        if not isinstance(title, str) or not title.strip():
            logger.debug("SKIP item — title not a string: %r", title)
            return None

        # ── 2. Question type from item[3] ─────────────────────────────────
        if len(item) <= 3:
            logger.debug("SKIP '%s' — item too short (%d elements)", title, len(item))
            return None

        gf_type = item[3]
        if not isinstance(gf_type, int) or gf_type not in _ITEM_TYPE_TO_IF:
            logger.debug("SKIP '%s' — unsupported item type %r", title, gf_type)
            return None

        # ── 3. Entry sub-list at item[4] ─────────────────────────────────
        if len(item) <= 4:
            logger.debug("SKIP '%s' — no entries (item[4] missing)", title)
            return None

        entries = item[4]
        if not isinstance(entries, list) or not entries:
            logger.debug("SKIP '%s' — item[4] empty or not a list", title)
            return None

        entry = entries[0]
        if not isinstance(entry, list) or len(entry) < 2:
            logger.debug("SKIP '%s' — entry[0] too short: %r", title, entry)
            return None

        # ── 4. Required flag at entry[2] ─────────────────────────────────
        required = False
        if len(entry) > 2 and isinstance(entry[2], int):
            required = bool(entry[2])

        # ── 5. Options and rating metadata ───────────────────────────────
        options: list[str] = []
        min_value: int | None = None
        max_value: int | None = None

        if gf_type in (2, 3, 4):          # MC / dropdown / checkbox
            options = _extract_options(entry)

        elif gf_type == 5:                 # Linear scale (rating)
            # entry[1] holds the scale points, e.g. [['1'],['2'],['3'],['4'],['5']]
            if isinstance(entry[1], list) and entry[1]:
                min_value = 1
                max_value = len(entry[1])
            else:
                min_value, max_value = 1, 5

        logger.debug(
            "PARSED '%s' — item_type=%d if_type=%s required=%s options_count=%d",
            title, gf_type, _ITEM_TYPE_TO_IF[gf_type], required, len(options),
        )
        return RawQuestion(
            gf_type=gf_type,
            title=title.strip(),
            required=required,
            options=options,
            min_value=min_value,
            max_value=max_value,
        )

    except (IndexError, TypeError) as exc:
        logger.debug("SKIP item — unexpected structure: %s", exc)
        return None


def parse_form(html: str) -> RawForm:
    form_data = extract_form_data(html)
    if form_data is None:
        raise FormParsingError(
            "Unable to parse form structure. The form may be private or the page format is unsupported."
        )

    try:
        form_meta = form_data[1]

        # Title: index 8 in standard structure
        form_title = "Imported Survey"
        for title_idx in (8, 4, 7):
            if (
                title_idx < len(form_meta)
                and isinstance(form_meta[title_idx], str)
                and form_meta[title_idx].strip()
            ):
                form_title = form_meta[title_idx].strip()
                break

        # Description: index 0
        form_description = ""
        if form_meta and isinstance(form_meta[0], str):
            form_description = form_meta[0]

        # Items: index 1
        items = (
            form_meta[1]
            if len(form_meta) > 1 and isinstance(form_meta[1], list)
            else []
        )

    except (IndexError, TypeError, KeyError) as exc:
        raise FormParsingError(f"Unexpected Google Forms data structure: {exc}")

    questions: list[RawQuestion] = []
    skipped = 0
    for item in items:
        if not isinstance(item, list):
            continue
        question = _parse_question_item(item)
        if question is not None:
            questions.append(question)
        else:
            skipped += 1

    if skipped:
        logger.info("Skipped %d unrecognized / unsupported form items", skipped)

    logger.info(
        "Parsed form '%s' — %d question(s) extracted (%d skipped)",
        form_title, len(questions), skipped,
    )
    return RawForm(title=form_title, description=form_description, questions=questions)

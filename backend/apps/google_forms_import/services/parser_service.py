import logging

import requests

from apps.google_forms_import.constants import MAX_RESPONSE_SIZE_BYTES, REQUEST_TIMEOUT_SECONDS
from apps.google_forms_import.exceptions import FormParsingError, FormRetrievalError
from apps.google_forms_import.types import RawForm, RawQuestion
from apps.google_forms_import.utils.html_parser import extract_form_data

logger = logging.getLogger(__name__)

_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; InsightFlow/1.0)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}


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
    options: list[str] = []
    try:
        raw_options = entry[1]
        if not isinstance(raw_options, list):
            return options
        for opt in raw_options:
            if isinstance(opt, list) and opt and opt[0]:
                options.append(str(opt[0]))
    except (IndexError, TypeError):
        pass
    return options


def _parse_question_item(item: list) -> RawQuestion | None:
    try:
        title = item[1]
        if not isinstance(title, str) or not title.strip():
            logger.debug("SKIP item — title not a string: %r", title)
            return None

        if len(item) <= 4:
            logger.debug("SKIP '%s' — item has only %d elements (need >4)", title, len(item))
            return None

        entries = item[4]
        if not isinstance(entries, list) or not entries:
            logger.debug("SKIP '%s' — item[4] is not a non-empty list: %r", title, entries)
            return None

        entry = entries[0]
        if not isinstance(entry, list):
            logger.debug("SKIP '%s' — entries[0] is not a list: %r", title, entry)
            return None

        if len(entry) < 8:
            logger.debug("SKIP '%s' — entry has only %d elements (need >=8): %r", title, len(entry), entry)
            return None

        gf_type = entry[7]
        if not isinstance(gf_type, int):
            logger.debug("SKIP '%s' — entry[7] is not an int: %r", title, gf_type)
            return None

        required = bool(entry[10]) if len(entry) > 10 and entry[10] else False
        options = _extract_options(entry)
        min_value = max_value = None
        if gf_type == 5:  # linear scale
            min_value, max_value = 1, 5
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
        form_title = form_meta[8] if isinstance(form_meta[8], str) else "Imported Survey"
        form_description = form_meta[0] if isinstance(form_meta[0], str) else ""
        items = form_meta[1] if isinstance(form_meta[1], list) else []
    except (IndexError, TypeError, KeyError) as exc:
        raise FormParsingError(f"Unexpected Google Forms data structure: {exc}")

    if items:
        logger.debug("RAW first question item: %r", items[0])

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
        logger.info("Skipped %d unrecognized form items during parsing", skipped)

    logger.info("Parsed form '%s' — extracted %d question(s)", form_title, len(questions))
    return RawForm(title=form_title, description=form_description, questions=questions)

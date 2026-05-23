import json
import logging

from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

_MARKER = "FB_PUBLIC_LOAD_DATA_ = "


def extract_form_data(html: str) -> list | None:
    soup = BeautifulSoup(html, "lxml")
    for script in soup.find_all("script"):
        text = script.string or ""
        idx = text.find(_MARKER)
        if idx == -1:
            continue
        start = idx + len(_MARKER)
        if start >= len(text) or text[start] != "[":
            continue
        try:
            data, _ = json.JSONDecoder().raw_decode(text, start)
            return data
        except (json.JSONDecodeError, ValueError) as exc:
            logger.debug("JSON decode failed in script tag: %s", exc)
            continue
    logger.warning("FB_PUBLIC_LOAD_DATA_ not found in any script tag")
    return None

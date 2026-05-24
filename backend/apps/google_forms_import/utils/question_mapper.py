# Google Forms item[3] question type integers → InsightFlow question types
#
# Type source: item[3] in FB_PUBLIC_LOAD_DATA_ (item-level, NOT entry[7])
#
#   0 = short answer   → short_text
#   1 = paragraph      → long_text
#   2 = multiple choice→ multiple_choice
#   3 = dropdown       → multiple_choice  (closest InsightFlow equivalent)
#   4 = checkboxes     → checkbox
#   5 = linear scale   → rating
#   6 = MC grid        → (unsupported)
#   7 = checkbox grid  → (unsupported)
#   8 = date           → (unsupported)
#   9 = time           → (unsupported)

_GF_TO_IF_TYPE: dict[int, str] = {
    0: "short_text",
    1: "long_text",
    2: "multiple_choice",
    3: "multiple_choice",   # dropdown maps to multiple_choice
    4: "checkbox",
    5: "rating",
}

SUPPORTED_GF_TYPES: frozenset[int] = frozenset(_GF_TO_IF_TYPE.keys())


def map_question_type(gf_type: int) -> str | None:
    return _GF_TO_IF_TYPE.get(gf_type)

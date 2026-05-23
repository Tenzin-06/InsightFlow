# Google Forms internal question type integers → InsightFlow question types
# GF types: 0=short answer, 1=paragraph, 2=multiple choice, 3=dropdown,
#           4=checkboxes, 5=linear scale, 6=MC grid, 7=checkbox grid, 8=date, 9=time
_GF_TO_IF_TYPE: dict[int, str] = {
    0: "short_text",       # Short Answer
    1: "long_text",        # Paragraph
    2: "multiple_choice",  # Multiple Choice
    4: "checkbox",         # Checkboxes
    5: "rating",           # Linear Scale
}

SUPPORTED_GF_TYPES: frozenset[int] = frozenset(_GF_TO_IF_TYPE.keys())


def map_question_type(gf_type: int) -> str | None:
    return _GF_TO_IF_TYPE.get(gf_type)

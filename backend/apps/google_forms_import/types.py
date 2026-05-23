from typing import TypedDict


class RawQuestion(TypedDict):
    gf_type: int
    title: str
    required: bool
    options: list[str]
    min_value: int | None
    max_value: int | None


class RawForm(TypedDict):
    title: str
    description: str
    questions: list[RawQuestion]


class NormalizedQuestion(TypedDict):
    question_text: str
    question_type: str
    is_required: bool
    order: int
    metadata: dict


class NormalizedForm(TypedDict):
    title: str
    description: str
    questions: list[NormalizedQuestion]

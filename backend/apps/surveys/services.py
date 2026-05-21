from apps.surveys.models.survey import Survey
from apps.surveys.models.question import Question


def get_surveys_for_user(user):
    return Survey.objects.filter(owner=user).prefetch_related("questions")


def get_survey_for_user(survey_id, user):
    return Survey.objects.filter(pk=survey_id, owner=user).prefetch_related("questions").first()


def create_survey(owner, title, description="", status="draft", is_public=False):
    return Survey.objects.create(
        owner=owner,
        title=title,
        description=description,
        status=status,
        is_public=is_public,
    )


def update_survey(survey, **fields):
    for attr, value in fields.items():
        setattr(survey, attr, value)
    survey.save()
    return survey


def delete_survey(survey):
    survey.delete()


def create_question(survey, question_text, question_type, is_required=False, order=0, metadata=None):
    return Question.objects.create(
        survey=survey,
        question_text=question_text,
        question_type=question_type,
        is_required=is_required,
        order=order,
        metadata=metadata or {},
    )


def update_question(question, **fields):
    for attr, value in fields.items():
        setattr(question, attr, value)
    question.save()
    return question


def delete_question(question):
    question.delete()

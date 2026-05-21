import { getRequest, postRequest, patchRequest, deleteRequest } from "@/lib/api/utils";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/lib/api/types";
import type {
  Survey,
  Question,
  CreateSurveyPayload,
  UpdateSurveyPayload,
  CreateQuestionPayload,
  UpdateQuestionPayload,
} from "@/features/surveys/types";

export async function getSurveys(): Promise<Survey[]> {
  const res = await getRequest<ApiResponse<Survey[]>>(API_ENDPOINTS.surveys.list);
  return res.data;
}

export async function getSurveyById(id: string): Promise<Survey> {
  const res = await getRequest<ApiResponse<Survey>>(API_ENDPOINTS.surveys.detail(id));
  return res.data;
}

export async function createSurvey(payload: CreateSurveyPayload): Promise<Survey> {
  const res = await postRequest<ApiResponse<Survey>, CreateSurveyPayload>(
    API_ENDPOINTS.surveys.list,
    payload
  );
  return res.data;
}

export async function updateSurvey(id: string, payload: UpdateSurveyPayload): Promise<Survey> {
  const res = await patchRequest<ApiResponse<Survey>, UpdateSurveyPayload>(
    API_ENDPOINTS.surveys.detail(id),
    payload
  );
  return res.data;
}

export async function deleteSurvey(id: string): Promise<void> {
  await deleteRequest<void>(API_ENDPOINTS.surveys.detail(id));
}

export async function getQuestions(surveyId: string): Promise<Question[]> {
  const res = await getRequest<ApiResponse<Question[]>>(API_ENDPOINTS.surveys.questions(surveyId));
  return res.data;
}

export async function createQuestion(
  surveyId: string,
  payload: CreateQuestionPayload
): Promise<Question> {
  const res = await postRequest<ApiResponse<Question>, CreateQuestionPayload>(
    API_ENDPOINTS.surveys.questions(surveyId),
    payload
  );
  return res.data;
}

export async function updateQuestion(
  questionId: string,
  payload: UpdateQuestionPayload
): Promise<Question> {
  const res = await patchRequest<ApiResponse<Question>, UpdateQuestionPayload>(
    API_ENDPOINTS.questions.detail(questionId),
    payload
  );
  return res.data;
}

export async function deleteQuestion(questionId: string): Promise<void> {
  await deleteRequest<void>(API_ENDPOINTS.questions.detail(questionId));
}

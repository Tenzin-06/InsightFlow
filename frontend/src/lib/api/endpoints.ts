export const API_ENDPOINTS = {
  health: "/health/",
  auth: {
    login: "/auth/login/",
    register: "/auth/register/",
  },
  surveys: {
    list: "/surveys/",
    detail: (id: string) => `/surveys/${id}/`,
    questions: (surveyId: string) => `/surveys/${surveyId}/questions/`,
  },
  questions: {
    detail: (id: string) => `/questions/${id}/`,
  },
  sharing: {
    surveyMeta: (slug: string) => `/sharing/surveys/${slug}/`,
  },
  audiences: {
    list: "/audiences/",
    detail: (id: string) => `/audiences/${id}/`,
    upload: (id: string) => `/audiences/${id}/upload/`,
    recipients: (id: string) => `/audiences/${id}/recipients/`,
  },
  aiAnalytics: {
    summary: (surveyId: number) => `/api/v1/ai-analytics/summary/${surveyId}/`,
    sentiment: (surveyId: number) =>
      `/api/v1/ai-analytics/sentiment/${surveyId}/`,
    quality: (surveyId: number) => `/api/v1/ai-analytics/quality/${surveyId}/`,
    questions: (surveyId: number) =>
      `/api/v1/ai-analytics/questions/${surveyId}/`,
  },
  simulation: {
    health: "/simulation/health/",
    runs: "/simulation/runs/",
    runDetail: (id: string) => `/simulation/runs/${id}/`,
    runExecute: (id: string) => `/simulation/runs/${id}/execute/`,
    runResults: (id: string) => `/simulation/runs/${id}/results/`,
    personas: "/simulation/personas/",
    personaDetail: (id: string) => `/simulation/personas/${id}/`,
  },
  googleFormsImport: {
    import: "/surveys/import/google/",
  },
};

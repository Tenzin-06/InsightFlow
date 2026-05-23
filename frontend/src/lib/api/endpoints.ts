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
};

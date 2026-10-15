const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('freecv_auth_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred while processing the request.';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Use fallback
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Auth
  register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  demoLogin: () => request<any>('/auth/demo-login', { method: 'POST' }),
  getMe: () => request<any>('/auth/me'),
  updateProfile: (data: any) => request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  exportUserData: () => request<any>('/auth/export-data', { method: 'POST' }),
  deleteAccount: () => request<any>('/auth/delete-account', { method: 'DELETE' }),

  // Resumes
  getResumes: (params?: { search?: string; archived?: boolean; sort?: string; order?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.archived !== undefined) query.append('archived', String(params.archived));
    if (params?.sort) query.append('sort', params.sort);
    if (params?.order) query.append('order', params.order);
    return request<any>(`/resumes?${query.toString()}`);
  },
  getResume: (id: string) => request<any>(`/resumes/${id}`),
  createResume: (data: { title: string; templateId?: string; initialData?: any }) =>
    request<any>('/resumes', { method: 'POST', body: JSON.stringify(data) }),
  updateResume: (id: string, data: any) =>
    request<any>(`/resumes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  duplicateResume: (id: string) =>
    request<any>(`/resumes/${id}/duplicate`, { method: 'POST' }),
  archiveResume: (id: string, isArchived: boolean) =>
    request<any>(`/resumes/${id}/archive`, { method: 'PATCH', body: JSON.stringify({ isArchived }) }),
  deleteResume: (id: string) =>
    request<any>(`/resumes/${id}`, { method: 'DELETE' }),
  getResumeVersions: (id: string) =>
    request<any>(`/resumes/${id}/versions`),
  restoreResumeVersion: (resumeId: string, versionId: string) =>
    request<any>(`/resumes/${resumeId}/versions/${versionId}/restore`, { method: 'POST' }),

  // Templates
  getTemplates: () => request<any>('/templates'),

  // Cover Letters
  getCoverLetters: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<any>(`/cover-letters${query}`);
  },
  getCoverLetter: (id: string) => request<any>(`/cover-letters/${id}`),
  createCoverLetter: (data: any) =>
    request<any>('/cover-letters', { method: 'POST', body: JSON.stringify(data) }),
  updateCoverLetter: (id: string, data: any) =>
    request<any>(`/cover-letters/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  duplicateCoverLetter: (id: string) =>
    request<any>(`/cover-letters/${id}/duplicate`, { method: 'POST' }),
  deleteCoverLetter: (id: string) =>
    request<any>(`/cover-letters/${id}`, { method: 'DELETE' }),

  // Applications
  getApplications: (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.search) query.append('search', params.search);
    return request<any>(`/applications?${query.toString()}`);
  },
  getApplicationStats: () => request<any>('/applications/stats'),
  createApplication: (data: any) =>
    request<any>('/applications', { method: 'POST', body: JSON.stringify(data) }),
  updateApplication: (id: string, data: any) =>
    request<any>(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteApplication: (id: string) =>
    request<any>(`/applications/${id}`, { method: 'DELETE' }),

  // ATS & JD Matching
  analyzeAts: (data: { resumeId?: string; resumeData?: any; jobDescription?: string }) =>
    request<any>('/ats/analyze', { method: 'POST', body: JSON.stringify(data) }),
  matchJobDescription: (data: {
    resumeId?: string;
    resumeData?: any;
    resumeText?: string;
    jobDescription: string;
    jobTitle?: string;
    company?: string;
  }) => request<any>('/ats/match-jd', { method: 'POST', body: JSON.stringify(data) }),

  // AI Assistant
  improveBullet: (data: { originalText: string; tone?: string; jobTitle?: string }) =>
    request<any>('/ai/improve-bullet', { method: 'POST', body: JSON.stringify(data) }),
  generateSummary: (data: { jobTitle: string; yearsOfExperience: number; keySkills: string[]; tone?: string }) =>
    request<any>('/ai/generate-summary', { method: 'POST', body: JSON.stringify(data) }),
  draftCoverLetter: (data: any) =>
    request<any>('/ai/draft-cover-letter', { method: 'POST', body: JSON.stringify(data) }),
  extractKeywords: (jobDescription: string) =>
    request<any>('/ai/extract-keywords', { method: 'POST', body: JSON.stringify({ jobDescription }) }),
  generateHeadline: (currentRole: string, specialties: string[]) =>
    request<any>('/ai/generate-headline', { method: 'POST', body: JSON.stringify({ currentRole, specialties }) }),
  translateResume: (data: { resumeData: any; targetLanguage: string }) =>
    request<any>('/ai/translate-resume', { method: 'POST', body: JSON.stringify(data) }),
  checkGrammar: (data: { text?: string; resumeData?: any }) =>
    request<any>('/ai/check-grammar', { method: 'POST', body: JSON.stringify(data) }),

  // Career Tools
  getSavedContent: (type?: string) => {
    const query = type ? `?type=${type}` : '';
    return request<any>(`/career-tools/saved-content${query}`);
  },
  saveContent: (data: any) =>
    request<any>('/career-tools/saved-content', { method: 'POST', body: JSON.stringify(data) }),
  deleteSavedContent: (id: string) =>
    request<any>(`/career-tools/saved-content/${id}`, { method: 'DELETE' }),
  getInterviewQuestions: (role: string, level: string) =>
    request<any>('/career-tools/interview-questions', { method: 'POST', body: JSON.stringify({ role, level }) }),
  getActionVerbs: () => request<any>('/career-tools/action-verbs'),

  // Import
  importFile: async (file: File) => {
    const token = localStorage.getItem('freecv_auth_token');
    const formData = new FormData();
    formData.append('resumeFile', file);

    const response = await fetch(`${API_BASE}/import/file`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'File import failed');
    }
    return response.json();
  },
  importText: (text: string) =>
    request<any>('/import/text', { method: 'POST', body: JSON.stringify({ text }) }),

  // Export
  exportResumePdf: async (data: any, design: any, title: string) => {
    const token = localStorage.getItem('freecv_auth_token');
    const response = await fetch(`${API_BASE}/export/resume/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data, design, title }),
    });
    if (!response.ok) throw new Error('PDF export failed.');
    return response.blob();
  },
  exportResumeDocx: async (data: any, design: any, title: string) => {
    const token = localStorage.getItem('freecv_auth_token');
    const response = await fetch(`${API_BASE}/export/resume/docx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data, design, title }),
    });
    if (!response.ok) throw new Error('DOCX export failed.');
    return response.blob();
  },
  exportCoverLetterPdf: async (data: any, design: any, title: string) => {
    const token = localStorage.getItem('freecv_auth_token');
    const response = await fetch(`${API_BASE}/export/cover-letter/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data, design, title }),
    });
    if (!response.ok) throw new Error('Cover letter PDF export failed.');
    return response.blob();
  },
  exportCoverLetterDocx: async (data: any, design: any, title: string) => {
    const token = localStorage.getItem('freecv_auth_token');
    const response = await fetch(`${API_BASE}/export/cover-letter/docx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ data, design, title }),
    });
    if (!response.ok) throw new Error('Cover letter DOCX export failed.');
    return response.blob();
  },
};

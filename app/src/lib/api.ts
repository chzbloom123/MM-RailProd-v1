export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface CampaignSummary {
  id: string;
  name: string;
  caseFileNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StorybookMeta {
  id: string;
  title: string;
  sizeBytes: number;
  createdAt: string;
}

export interface Campaign extends CampaignSummary {
  data: unknown;
  storybooks: StorybookMeta[];
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    ...init,
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new ApiError(res.status, body?.error ?? `Request failed (${res.status})`);
  }
  return body as T;
}

export const api = {
  auth: {
    register: (email: string, password: string) =>
      request<{ user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    login: (email: string, password: string) =>
      request<{ user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    logout: () => request<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
    me: () => request<{ user: User }>('/api/auth/me'),
  },
  campaigns: {
    list: () => request<{ campaigns: CampaignSummary[] }>('/api/campaigns'),
    create: (input: { name: string; caseFileNumber?: string; data?: unknown }) =>
      request<{ campaign: Campaign }>('/api/campaigns', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    get: (id: string) => request<{ campaign: Campaign }>(`/api/campaigns/${id}`),
    update: (
      id: string,
      patch: { name?: string; caseFileNumber?: string | null; data?: unknown },
    ) =>
      request<{ campaign: Campaign }>(`/api/campaigns/${id}`, {
        method: 'PUT',
        body: JSON.stringify(patch),
      }),
    delete: (id: string) =>
      request<{ ok: true }>(`/api/campaigns/${id}`, { method: 'DELETE' }),
  },
  storybooks: {
    upload: async (campaignId: string, file: File, title?: string) => {
      const form = new FormData();
      form.append('file', file);
      if (title) form.append('title', title);
      const res = await fetch(`/api/campaigns/${campaignId}/storybooks`, {
        method: 'POST',
        credentials: 'include',
        body: form,
      });
      const body = await res.json();
      if (!res.ok) throw new ApiError(res.status, body?.error ?? 'Upload failed');
      return body as { storybook: StorybookMeta };
    },
    downloadUrl: (id: string) => `/api/storybooks/${id}`,
    delete: (id: string) =>
      request<{ ok: true }>(`/api/storybooks/${id}`, { method: 'DELETE' }),
  },
};

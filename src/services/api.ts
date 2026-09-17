import { Task, DashboardStats, FilterOptions, User, DBStatus } from '../types/index.js';

const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('taskflow_token');
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('taskflow_token', token);
  } else {
    localStorage.removeItem('taskflow_token');
  }
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    return request<{ success: boolean; user: User; token: string; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: { name: string; email: string; password: string }) => {
    return request<{ success: boolean; user: User; token: string; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getMe: async () => {
    return request<{ success: boolean; user: User; dbStatus: DBStatus }>('/auth/me');
  },

  updateProfile: async (data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    return request<{ success: boolean; user: User; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      setAuthToken(null);
    }
  },
};

export const taskAPI = {
  getAll: async (filters?: Partial<FilterOptions>) => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters.priority && filters.priority !== 'All') params.append('priority', filters.priority);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    }
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request<{ success: boolean; count: number; tasks: Task[] }>(`/tasks${queryString}`);
  },

  getById: async (id: string) => {
    return request<{ success: boolean; task: Task }>(`/tasks/${id}`);
  },

  create: async (taskData: {
    title: string;
    description: string;
    priority: string;
    status: string;
    dueDate: string;
  }) => {
    return request<{ success: boolean; task: Task; message: string }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  update: async (
    id: string,
    updates: Partial<{
      title: string;
      description: string;
      priority: string;
      status: string;
      dueDate: string;
    }>
  ) => {
    return request<{ success: boolean; task: Task; message: string }>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string) => {
    return request<{ success: boolean; message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return request<{ success: boolean; stats: DashboardStats }>('/tasks/stats');
  },

  getDBStatus: async () => {
    return request<DBStatus>('/db-status');
  },
};

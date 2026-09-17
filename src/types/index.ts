export type TaskPriority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
  createdAt?: string;
}

export interface Task {
  _id: string;
  id?: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriorityBreakdown {
  low: number;
  medium: number;
  high: number;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  completionRate: number;
  priorityBreakdown: PriorityBreakdown;
  recentTasks: Task[];
}

export interface FilterOptions {
  search: string;
  status: 'All' | TaskStatus;
  priority: 'All' | TaskPriority;
  sortBy: 'dueDate' | 'createdAt' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface DBStatus {
  connected: boolean;
  mode: string;
  error: string | null;
  uri: string;
}

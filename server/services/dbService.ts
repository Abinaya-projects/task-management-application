import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { User, IUser } from '../models/User.js';
import { Task, ITask, TaskPriority, TaskStatus } from '../models/Task.js';

// Local storage fallback file
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'taskflow.json');

export interface StoredUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoredTask {
  _id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  user: string;
  createdAt: string;
  updatedAt: string;
}

interface StoredData {
  users: StoredUser[];
  tasks: StoredTask[];
}

function ensureDataFile(): StoredData {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initial: StoredData = { users: [], tasks: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    const fallback: StoredData = { users: [], tasks: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

function saveDataFile(data: StoredData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving local fallback data:', err);
  }
}

export const isMongooseReady = (): boolean => {
  return !!(mongoose.connection && mongoose.connection.readyState === 1);
};

// USER OPERATIONS
export const dbFindUserByEmail = async (email: string) => {
  if (isMongooseReady()) {
    return await (User as any).findOne({ email: email.toLowerCase().trim() }).exec();
  }
  const data = ensureDataFile();
  return data.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
};

export const dbFindUserById = async (id: string) => {
  if (isMongooseReady()) {
    return await (User as any).findById(id).select('-password').lean().exec();
  }
  const data = ensureDataFile();
  const user = data.users.find((u) => u._id === id);
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

export const dbCreateUser = async (userData: {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role?: string;
}) => {
  if (isMongooseReady()) {
    const user = new User({
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: userData.password,
      avatar: userData.avatar || '',
      role: userData.role || 'user',
    });
    return await user.save();
  }
  const data = ensureDataFile();
  const now = new Date().toISOString();
  const newUser: StoredUser = {
    _id: crypto.randomBytes(12).toString('hex'),
    name: userData.name,
    email: userData.email.toLowerCase().trim(),
    password: userData.password,
    avatar: userData.avatar || '',
    role: userData.role || 'user',
    createdAt: now,
    updatedAt: now,
  };
  data.users.push(newUser);
  saveDataFile(data);
  return newUser;
};

export const dbUpdateUser = async (id: string, updates: Partial<IUser>) => {
  if (isMongooseReady()) {
    return await (User as any)
      .findByIdAndUpdate(id, updates, { new: true })
      .select('-password')
      .lean()
      .exec();
  }
  const data = ensureDataFile();
  const index = data.users.findIndex((u) => u._id === id);
  if (index === -1) return null;
  data.users[index] = {
    ...data.users[index],
    ...(updates as any),
    updatedAt: new Date().toISOString(),
  };
  saveDataFile(data);
  const { password, ...rest } = data.users[index];
  return rest;
};

// TASK OPERATIONS
export interface TaskQueryParams {
  userId: string;
  search?: string;
  status?: string;
  priority?: string;
  sortBy?: 'dueDate' | 'createdAt' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export const dbGetTasks = async (params: TaskQueryParams) => {
  const { userId, search, status, priority, sortBy = 'dueDate', sortOrder = 'asc' } = params;

  if (isMongooseReady()) {
    const query: any = { user: userId };
    if (status && status !== 'All') {
      query.status = status;
    }
    if (priority && priority !== 'All') {
      query.priority = priority;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions: any = {};
    const order = sortOrder === 'desc' ? -1 : 1;
    sortOptions[sortBy] = order;

    return await (Task as any).find(query).sort(sortOptions).lean().exec();
  }

  // Fallback
  const data = ensureDataFile();
  let userTasks = data.tasks.filter((t) => t.user === userId);

  if (status && status !== 'All') {
    userTasks = userTasks.filter((t) => t.status === status);
  }
  if (priority && priority !== 'All') {
    userTasks = userTasks.filter((t) => t.priority === priority);
  }
  if (search) {
    const term = search.toLowerCase();
    userTasks = userTasks.filter(
      (t) =>
        t.title.toLowerCase().includes(term) || (t.description && t.description.toLowerCase().includes(term))
    );
  }

  userTasks.sort((a: any, b: any) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'priority') {
      const priorityWeight: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      valA = priorityWeight[a.priority] || 0;
      valB = priorityWeight[b.priority] || 0;
    } else if (sortBy === 'dueDate' || sortBy === 'createdAt') {
      valA = new Date(valA).getTime();
      valB = new Date(valB).getTime();
    }

    if (valA < valB) return sortOrder === 'desc' ? 1 : -1;
    if (valA > valB) return sortOrder === 'desc' ? -1 : 1;
    return 0;
  });

  return userTasks;
};

export const dbGetTaskById = async (id: string, userId: string) => {
  if (isMongooseReady()) {
    return await (Task as any).findOne({ _id: id, user: userId }).lean().exec();
  }
  const data = ensureDataFile();
  return data.tasks.find((t) => t._id === id && t.user === userId) || null;
};

export const dbCreateTask = async (taskData: {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string | Date;
  userId: string;
}) => {
  if (isMongooseReady()) {
    const task = new Task({
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
      dueDate: new Date(taskData.dueDate),
      user: taskData.userId,
    });
    return await task.save();
  }

  const data = ensureDataFile();
  const now = new Date().toISOString();
  const newTask: StoredTask = {
    _id: crypto.randomBytes(12).toString('hex'),
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority,
    status: taskData.status,
    dueDate: new Date(taskData.dueDate).toISOString(),
    user: taskData.userId,
    createdAt: now,
    updatedAt: now,
  };
  data.tasks.unshift(newTask);
  saveDataFile(data);
  return newTask;
};

export const dbUpdateTask = async (
  id: string,
  userId: string,
  updates: Partial<ITask>
) => {
  if (isMongooseReady()) {
    return await (Task as any)
      .findOneAndUpdate(
        { _id: id, user: userId },
        { ...updates, updatedAt: new Date() },
        { new: true }
      )
      .lean()
      .exec();
  }

  const data = ensureDataFile();
  const index = data.tasks.findIndex((t) => t._id === id && t.user === userId);
  if (index === -1) return null;

  data.tasks[index] = {
    ...data.tasks[index],
    ...(updates as any),
    updatedAt: new Date().toISOString(),
  };
  saveDataFile(data);
  return data.tasks[index];
};

export const dbDeleteTask = async (id: string, userId: string) => {
  if (isMongooseReady()) {
    const res = await (Task as any).findOneAndDelete({ _id: id, user: userId }).exec();
    return !!res;
  }

  const data = ensureDataFile();
  const initialLen = data.tasks.length;
  data.tasks = data.tasks.filter((t) => !(t._id === id && t.user === userId));
  if (data.tasks.length !== initialLen) {
    saveDataFile(data);
    return true;
  }
  return false;
};

export const dbGetDashboardStats = async (userId: string) => {
  let userTasks: any[] = [];
  if (isMongooseReady()) {
    userTasks = await (Task as any).find({ user: userId }).sort({ createdAt: -1 }).lean().exec();
  } else {
    const data = ensureDataFile();
    userTasks = data.tasks.filter((t) => t.user === userId);
  }

  const now = new Date();
  const total = userTasks.length;
  const pending = userTasks.filter((t) => t.status === 'Pending').length;
  const inProgress = userTasks.filter((t) => t.status === 'In Progress').length;
  const completed = userTasks.filter((t) => t.status === 'Completed').length;
  const overdue = userTasks.filter(
    (t) => t.status !== 'Completed' && new Date(t.dueDate) < now
  ).length;

  const lowPriority = userTasks.filter((t) => t.priority === 'Low').length;
  const mediumPriority = userTasks.filter((t) => t.priority === 'Medium').length;
  const highPriority = userTasks.filter((t) => t.priority === 'High').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const recentTasks = [...userTasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    total,
    pending,
    inProgress,
    completed,
    overdue,
    completionRate,
    priorityBreakdown: {
      low: lowPriority,
      medium: mediumPriority,
      high: highPriority,
    },
    recentTasks,
  };
};

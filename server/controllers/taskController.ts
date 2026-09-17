import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import {
  dbGetTasks,
  dbGetTaskById,
  dbCreateTask,
  dbUpdateTask,
  dbDeleteTask,
  dbGetDashboardStats,
} from '../services/dbService.js';
import { TaskPriority, TaskStatus } from '../models/Task.js';

// @desc    Get all tasks for current user with filters & sorting
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { search, status, priority, sortBy, sortOrder } = req.query;

    const tasks = await dbGetTasks({
      userId: req.user.id,
      search: search as string,
      status: status as string,
      priority: priority as string,
      sortBy: (sortBy as any) || 'dueDate',
      sortOrder: (sortOrder as any) || 'asc',
    });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error: any) {
    console.error('getTasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks',
      error: error.message,
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const task = await dbGetTaskById(req.params.id, req.user.id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to view it',
      });
      return;
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error: any) {
    console.error('getTaskById error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task details',
    });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { title, description, priority = 'Medium', status = 'Pending', dueDate } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
      return;
    }

    if (!dueDate) {
      res.status(400).json({
        success: false,
        message: 'Due date is required',
      });
      return;
    }

    const validPriorities: TaskPriority[] = ['Low', 'Medium', 'High'];
    if (priority && !validPriorities.includes(priority)) {
      res.status(400).json({
        success: false,
        message: 'Invalid priority. Allowed values: Low, Medium, High',
      });
      return;
    }

    const validStatuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: Pending, In Progress, Completed',
      });
      return;
    }

    const newTask = await dbCreateTask({
      title: title.trim(),
      description: (description || '').trim(),
      priority: priority as TaskPriority,
      status: status as TaskStatus,
      dueDate: new Date(dueDate),
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error: any) {
    console.error('createTask error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message,
    });
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { title, description, priority, status, dueDate } = req.body;
    const updates: any = {};

    if (title !== undefined) {
      if (!title.trim()) {
        res.status(400).json({ success: false, message: 'Task title cannot be empty' });
        return;
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description.trim();
    }

    if (priority !== undefined) {
      const validPriorities: TaskPriority[] = ['Low', 'Medium', 'High'];
      if (!validPriorities.includes(priority)) {
        res.status(400).json({ success: false, message: 'Invalid priority value' });
        return;
      }
      updates.priority = priority;
    }

    if (status !== undefined) {
      const validStatuses: TaskStatus[] = ['Pending', 'In Progress', 'Completed'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ success: false, message: 'Invalid status value' });
        return;
      }
      updates.status = status;
    }

    if (dueDate !== undefined) {
      updates.dueDate = new Date(dueDate);
    }

    const updatedTask = await dbUpdateTask(req.params.id, req.user.id, updates);

    if (!updatedTask) {
      res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to update it',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error: any) {
    console.error('updateTask error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const deleted = await dbDeleteTask(req.params.id, req.user.id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to delete it',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error: any) {
    console.error('deleteTask error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
    });
  }
};

// @desc    Get dashboard metrics & statistics for current user
// @route   GET /api/tasks/stats
// @access  Private
export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const stats = await dbGetDashboardStats(req.user.id);

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to compute dashboard metrics',
    });
  }
};

import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/index.js';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Flag,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onViewDetails: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange,
}) => {
  const isOverdue =
    task.status !== 'Completed' && new Date(task.dueDate) < new Date();

  // Format Due Date
  const dueDateObj = new Date(task.dueDate);
  const formattedDueDate = dueDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate days left
  const diffDays = Math.ceil(
    (dueDateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  let dueLabel = formattedDueDate;
  if (task.status === 'Completed') {
    dueLabel = `Completed (${formattedDueDate})`;
  } else if (diffDays < 0) {
    dueLabel = `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`;
  } else if (diffDays === 0) {
    dueLabel = 'Due today';
  } else if (diffDays === 1) {
    dueLabel = 'Due tomorrow';
  } else {
    dueLabel = `${diffDays} days left`;
  }

  // Priority badge styling
  const priorityStyles: Record<TaskPriority, { badge: string; dot: string }> = {
    High: {
      badge: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500',
    },
    Medium: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500',
    },
    Low: {
      badge: 'bg-slate-100 text-slate-700 border-slate-200/80',
      dot: 'bg-slate-400',
    },
  };

  // Status badge styling
  const statusStyles: Record<TaskStatus, { badge: string; icon: any }> = {
    'Completed': {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
    'In Progress': {
      badge: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Clock,
    },
    'Pending': {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertCircle,
    },
  };

  const StatusIcon = statusStyles[task.status]?.icon || AlertCircle;

  return (
    <div
      id={`task-card-${task._id}`}
      className={`group relative flex flex-col justify-between p-5 bg-white rounded-2xl border transition-all duration-200 hover:shadow-md ${
        isOverdue
          ? 'border-rose-300 ring-1 ring-rose-100'
          : task.status === 'Completed'
          ? 'border-emerald-200 bg-emerald-50/20'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Top Badges & Status Switcher */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Priority Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              priorityStyles[task.priority]?.badge
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                priorityStyles[task.priority]?.dot
              }`}
            />
            {task.priority} Priority
          </span>

          {/* Quick Status Selector */}
          <div className="relative">
            <select
              id={`task-status-select-${task._id}`}
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
              className={`text-xs font-semibold py-1 pl-2.5 pr-6 rounded-lg border cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 appearance-none ${
                statusStyles[task.status]?.badge
              }`}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-500">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onViewDetails(task)}
          className={`text-base font-bold text-slate-900 tracking-tight cursor-pointer hover:text-indigo-600 transition-colors line-clamp-1 mb-1.5 ${
            task.status === 'Completed' ? 'line-through text-slate-500' : ''
          }`}
        >
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4 min-h-[2rem]">
          {task.description || (
            <span className="italic text-slate-400">No additional description provided.</span>
          )}
        </p>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
        {/* Due Date Indicator */}
        <div className="flex items-center justify-between text-xs">
          <div
            className={`flex items-center gap-1.5 font-medium ${
              isOverdue
                ? 'text-rose-600 font-semibold'
                : task.status === 'Completed'
                ? 'text-emerald-600'
                : 'text-slate-500'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{dueLabel}</span>
          </div>

          <span className="text-[11px] text-slate-400 font-medium">
            {formattedDueDate}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-1 pt-1">
          <button
            id={`task-view-btn-${task._id}`}
            onClick={() => onViewDetails(task)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>

          <div className="flex items-center gap-1">
            <button
              id={`task-edit-btn-${task._id}`}
              onClick={() => onEdit(task)}
              title="Edit Task"
              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              aria-label="Edit task"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              id={`task-delete-btn-${task._id}`}
              onClick={() => onDelete(task)}
              title="Delete Task"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              aria-label="Delete task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

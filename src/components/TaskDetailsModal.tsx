import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/index.js';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Flag,
} from 'lucide-react';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (!isOpen || !task) return null;

  const dueDateObj = new Date(task.dueDate);
  const createdDateObj = new Date(task.createdAt);
  const updatedDateObj = new Date(task.updatedAt || task.createdAt);
  const isOverdue =
    task.status !== 'Completed' && dueDateObj < new Date();

  const priorityStyles: Record<TaskPriority, string> = {
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const statusStyles: Record<TaskStatus, { badge: string; icon: any }> = {
    'Completed': { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    'In Progress': { badge: 'bg-sky-50 text-sky-700 border-sky-200', icon: Clock },
    'Pending': { badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertCircle },
  };

  return (
    <div
      id="task-details-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="task-details-modal"
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                priorityStyles[task.priority]
              }`}
            >
              {task.priority} Priority
            </span>

            <select
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
              className={`text-xs font-semibold py-0.5 px-2.5 rounded-full border cursor-pointer ${
                statusStyles[task.status]?.badge
              }`}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button
            id="task-details-close-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {task.title}
            </h2>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Description
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {task.description || (
                <span className="italic text-slate-400">No description provided.</span>
              )}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Due Date
              </span>
              <div
                className={`flex items-center gap-2 mt-1 text-sm font-bold ${
                  isOverdue ? 'text-rose-600' : 'text-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>
                  {dueDateObj.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                {isOverdue && (
                  <span className="text-[10px] uppercase font-bold bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded border border-rose-200">
                    Overdue
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 bg-white">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Created Date
              </span>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-slate-800">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>
                  {createdDateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            id="details-delete-btn"
            onClick={() => {
              onDelete(task);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Task</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="details-edit-btn"
              onClick={() => {
                onEdit(task);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Task</span>
            </button>

            <button
              id="details-close-modal-btn"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

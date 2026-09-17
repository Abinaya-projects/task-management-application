import React from 'react';
import { Task, TaskPriority, TaskStatus } from '../types/index.js';
import { Calendar, Eye, Edit2, Trash2 } from 'lucide-react';

interface TaskTableViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onViewDetails: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}

export const TaskTableView: React.FC<TaskTableViewProps> = ({
  tasks,
  onEdit,
  onDelete,
  onViewDetails,
  onStatusChange,
}) => {
  const priorityStyles: Record<TaskPriority, string> = {
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const statusStyles: Record<TaskStatus, string> = {
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'In Progress': 'bg-sky-50 text-sky-700 border-sky-200',
    'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <th className="py-3.5 px-4">Task</th>
            <th className="py-3.5 px-4">Priority</th>
            <th className="py-3.5 px-4">Status</th>
            <th className="py-3.5 px-4">Due Date</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {tasks.map((task) => {
            const dueDateObj = new Date(task.dueDate);
            const isOverdue =
              task.status !== 'Completed' && dueDateObj < new Date();
            const formattedDate = dueDateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <tr
                key={task._id}
                id={`table-row-task-${task._id}`}
                className="hover:bg-slate-50/80 transition-colors"
              >
                {/* Title & Description */}
                <td className="py-3.5 px-4 max-w-xs">
                  <div
                    onClick={() => onViewDetails(task)}
                    className="font-semibold text-slate-900 hover:text-indigo-600 cursor-pointer truncate"
                  >
                    {task.title}
                  </div>
                  {task.description && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {task.description}
                    </p>
                  )}
                </td>

                {/* Priority */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      priorityStyles[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>

                {/* Status Selector */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task, e.target.value as TaskStatus)}
                    className={`text-xs font-semibold py-1 px-2.5 rounded-lg border cursor-pointer focus:outline-hidden ${
                      statusStyles[task.status]
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>

                {/* Due Date */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div
                    className={`flex items-center gap-1.5 text-xs font-medium ${
                      isOverdue
                        ? 'text-rose-600 font-semibold'
                        : 'text-slate-600'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formattedDate}</span>
                    {isOverdue && (
                      <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        Overdue
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onViewDetails(task)}
                      title="View Details"
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      aria-label="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(task)}
                      title="Edit Task"
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      aria-label="Edit Task"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(task)}
                      title="Delete Task"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      aria-label="Delete Task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

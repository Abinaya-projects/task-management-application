import React, { useState, useMemo } from 'react';
import { Task, TaskPriority, TaskStatus, FilterOptions } from '../types/index.js';
import { TaskCard } from '../components/TaskCard.js';
import { TaskTableView } from '../components/TaskTableView.js';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  Plus,
  X,
  CheckSquare,
} from 'lucide-react';

interface TasksPageProps {
  tasks: Task[];
  isLoading: boolean;
  onOpenCreateModal: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onViewTaskDetails: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
  initialStatusFilter?: string;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  isLoading,
  onOpenCreateModal,
  onEditTask,
  onDeleteTask,
  onViewTaskDetails,
  onStatusChange,
  initialStatusFilter = 'All',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | TaskStatus>(
    (initialStatusFilter as any) || 'All'
  );
  const [priorityFilter, setPriorityFilter] = useState<'All' | TaskPriority>('All');
  const [sortBy, setSortBy] = useState<'dueDate' | 'createdAt' | 'priority' | 'title'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter & Sort tasks on client for instant responsiveness (and backend query also matches)
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Status
    if (statusFilter !== 'All') {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Priority
    if (priorityFilter !== 'All') {
      result = result.filter((t) => t.priority === priorityFilter);
    }

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(term) ||
          (t.description && t.description.toLowerCase().includes(term))
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];

      if (sortBy === 'priority') {
        const weight: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
        valA = weight[a.priority] || 0;
        valB = weight[b.priority] || 0;
      } else if (sortBy === 'dueDate' || sortBy === 'createdAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (sortBy === 'title') {
        valA = a.title.toLowerCase();
        valB = b.title.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'desc' ? 1 : -1;
      if (valA > valB) return sortOrder === 'desc' ? -1 : 1;
      return 0;
    });

    return result;
  }, [tasks, statusFilter, priorityFilter, searchTerm, sortBy, sortOrder]);

  const hasActiveFilters =
    searchTerm !== '' || statusFilter !== 'All' || priorityFilter !== 'All';

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSortBy('dueDate');
    setSortOrder('asc');
  };

  const statusOptions: Array<'All' | TaskStatus> = [
    'All',
    'Pending',
    'In Progress',
    'Completed',
  ];

  return (
    <div id="tasks-page" className="space-y-6 pb-12">
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Task Management
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Organize, prioritize, and track all your academic assignments and project tasks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              id="view-mode-grid-btn"
              onClick={() => setViewMode('grid')}
              title="Grid Cards View"
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              id="view-mode-table-btn"
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add Task Button */}
          <button
            id="tasks-add-task-btn"
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        {/* Top row: Search + Selects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="lg:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="tasks-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks by title or description..."
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-hidden transition-all text-slate-800 placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Priority filter */}
          <div className="lg:col-span-3">
            <select
              id="tasks-priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-hidden"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          {/* Sort selector */}
          <div className="lg:col-span-4 flex items-center gap-2">
            <select
              id="tasks-sort-by-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-');
                setSortBy(by as any);
                setSortOrder(order as any);
              }}
              className="w-full py-2 px-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-hidden"
            >
              <option value="dueDate-asc">Due Date: Soonest first</option>
              <option value="dueDate-desc">Due Date: Furthest first</option>
              <option value="createdAt-desc">Created: Newest first</option>
              <option value="createdAt-asc">Created: Oldest first</option>
              <option value="priority-desc">Priority: Highest first</option>
              <option value="title-asc">Title: Alphabetical (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Bottom row: Status Pills & Active Filter Tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {statusOptions.map((st) => {
              const isActive = statusFilter === st;
              const count =
                st === 'All'
                  ? tasks.length
                  : tasks.filter((t) => t.status === st).length;

              return (
                <button
                  key={st}
                  id={`filter-status-${st.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st} ({count})
                </button>
              );
            })}
          </div>

          {/* Active summary & reset */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900">{filteredTasks.length}</strong> of{' '}
              {tasks.length} tasks
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-indigo-600 hover:text-indigo-800 font-semibold underline text-xs"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tasks Content: Grid or Table */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading tasks...</p>
          </div>
        </div>
      ) : filteredTasks.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 max-w-lg mx-auto">
          <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 text-indigo-600">
            <CheckSquare className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {hasActiveFilters ? 'No tasks match your criteria' : 'No tasks created yet'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto mb-5">
            {hasActiveFilters
              ? 'Try modifying your search query or reset the priority and status filters.'
              : 'Create your first academic assignment or project task to begin managing your workflow.'}
          </p>

          {hasActiveFilters ? (
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              Clear All Filters
            </button>
          ) : (
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Task</span>
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onViewDetails={onViewTaskDetails}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <TaskTableView
          tasks={filteredTasks}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onViewDetails={onViewTaskDetails}
          onStatusChange={onStatusChange}
        />
      )}
    </div>
  );
};

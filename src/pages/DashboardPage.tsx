import React from 'react';
import { DashboardStats, Task, TaskStatus } from '../types/index.js';
import { StatCard } from '../components/StatCard.js';
import { ProgressBar } from '../components/ProgressBar.js';
import { TaskCard } from '../components/TaskCard.js';
import { useAuth } from '../context/AuthContext.js';
import {
  CheckSquare,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  Flame,
} from 'lucide-react';

interface DashboardPageProps {
  stats: DashboardStats | null;
  isLoading: boolean;
  onNavigateToTasks: (status?: string) => void;
  onOpenCreateModal: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onViewTaskDetails: (task: Task) => void;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  isLoading,
  onNavigateToTasks,
  onOpenCreateModal,
  onEditTask,
  onDeleteTask,
  onViewTaskDetails,
  onStatusChange,
}) => {
  const { user } = useAuth();

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading dashboard metrics...</p>
        </div>
      </div>
    );
  }

  const s = stats || {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    completionRate: 0,
    priorityBreakdown: { low: 0, medium: 0, high: 0 },
    recentTasks: [],
  };

  return (
    <div id="dashboard-page" className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl text-white shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-200 text-xs font-medium backdrop-blur-xs">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Task Management Dashboard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Hello, {user?.name || 'Student'}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-indigo-200/80 max-w-xl">
            {s.total === 0
              ? 'Get started by creating your first task to track your academic and personal project deadlines.'
              : `You have ${s.pending} pending task${s.pending === 1 ? '' : 's'} and ${s.overdue} overdue deadline${s.overdue === 1 ? '' : 's'}. Keep up the momentum!`}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="dash-add-task-banner-btn"
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-900 font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          id="stat-total"
          title="Total Tasks"
          count={s.total}
          icon={CheckSquare}
          colorClass="text-slate-900"
          iconBgClass="bg-slate-100 text-slate-700"
          onClick={() => onNavigateToTasks('All')}
        />
        <StatCard
          id="stat-pending"
          title="Pending"
          count={s.pending}
          icon={Clock}
          colorClass="text-amber-600"
          iconBgClass="bg-amber-50 text-amber-600"
          onClick={() => onNavigateToTasks('Pending')}
        />
        <StatCard
          id="stat-in-progress"
          title="In Progress"
          count={s.inProgress}
          icon={Activity}
          colorClass="text-sky-600"
          iconBgClass="bg-sky-50 text-sky-600"
          onClick={() => onNavigateToTasks('In Progress')}
        />
        <StatCard
          id="stat-completed"
          title="Completed"
          count={s.completed}
          icon={CheckCircle2}
          colorClass="text-emerald-600"
          iconBgClass="bg-emerald-50 text-emerald-600"
          onClick={() => onNavigateToTasks('Completed')}
        />
        <StatCard
          id="stat-overdue"
          title="Overdue"
          count={s.overdue}
          icon={AlertTriangle}
          colorClass="text-rose-600"
          iconBgClass="bg-rose-50 text-rose-600"
          onClick={() => onNavigateToTasks('All')}
        />
      </div>

      {/* Progress & Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <ProgressBar
            total={s.total}
            completed={s.completed}
            inProgress={s.inProgress}
            pending={s.pending}
            completionRate={s.completionRate}
          />
        </div>

        {/* Priority Distribution Card */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Priority Distribution</h3>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xs text-slate-500 mb-4">Breakdown of active priorities</p>

            <div className="space-y-3">
              {/* High Priority */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-rose-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> High Priority
                  </span>
                  <span className="font-bold text-slate-900">{s.priorityBreakdown.high}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${s.total > 0 ? (s.priorityBreakdown.high / s.total) * 100 : 0}%`,
                    }}
                    className="h-full bg-rose-500 rounded-full"
                  />
                </div>
              </div>

              {/* Medium Priority */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-amber-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> Medium Priority
                  </span>
                  <span className="font-bold text-slate-900">{s.priorityBreakdown.medium}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${s.total > 0 ? (s.priorityBreakdown.medium / s.total) * 100 : 0}%`,
                    }}
                    className="h-full bg-amber-500 rounded-full"
                  />
                </div>
              </div>

              {/* Low Priority */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400" /> Low Priority
                  </span>
                  <span className="font-bold text-slate-900">{s.priorityBreakdown.low}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${s.total > 0 ? (s.priorityBreakdown.low / s.total) * 100 : 0}%`,
                    }}
                    className="h-full bg-slate-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTasks('All')}
            className="flex items-center justify-center gap-1.5 w-full mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <span>View all tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Tasks</h3>
            <p className="text-xs text-slate-500">Your latest created deadlines and assignments</p>
          </div>

          <button
            onClick={() => onNavigateToTasks('All')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {s.recentTasks.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-indigo-50 text-indigo-600">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">No tasks created yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Start planning your college assignments, exams, and projects by adding your first task.
            </p>
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Task</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {s.recentTasks.map((task) => (
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
        )}
      </div>
    </div>
  );
};

import React from 'react';

interface ProgressBarProps {
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionRate: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  total,
  completed,
  inProgress,
  pending,
  completionRate,
}) => {
  const completedPct = total > 0 ? (completed / total) * 100 : 0;
  const inProgressPct = total > 0 ? (inProgress / total) * 100 : 0;
  const pendingPct = total > 0 ? (pending / total) * 100 : 0;

  return (
    <div id="dashboard-progress-card" className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Task Completion Rate</h2>
          <p className="text-xs text-slate-500 font-medium">Overall productivity progress</p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-indigo-600">{completionRate}%</span>
          <span className="text-xs font-semibold text-slate-400">completed</span>
        </div>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-slate-200/60">
        <div
          title={`Completed: ${completed}`}
          style={{ width: `${completedPct}%` }}
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
        />
        <div
          title={`In Progress: ${inProgress}`}
          style={{ width: `${inProgressPct}%` }}
          className="h-full bg-sky-500 rounded-full transition-all duration-500"
        />
        <div
          title={`Pending: ${pending}`}
          style={{ width: `${pendingPct}%` }}
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
        />
      </div>

      {/* Breakdown Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-600 font-medium">
            Completed: <strong className="text-slate-900">{completed}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
          <span className="text-slate-600 font-medium">
            In Progress: <strong className="text-slate-900">{inProgress}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-slate-600 font-medium">
            Pending: <strong className="text-slate-900">{pending}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <span>Total:</span>
          <strong className="text-slate-900">{total}</strong>
        </div>
      </div>
    </div>
  );
};

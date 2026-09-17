import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  Activity,
  CheckCircle2,
  User,
  LogOut,
  PlusCircle,
  Database,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string, filterStatus?: string) => void;
  onOpenCreateModal: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  taskCounts?: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  onOpenCreateModal,
  isOpenMobile,
  onCloseMobile,
  taskCounts = { total: 0, pending: 0, inProgress: 0, completed: 0 },
}) => {
  const { user, logout, dbStatus } = useAuth();

  const handleNav = (tab: string, status?: string) => {
    onNavigate(tab, status);
    onCloseMobile();
  };

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      onClick: () => handleNav('dashboard'),
    },
    {
      id: 'tasks',
      label: 'All Tasks',
      icon: CheckSquare,
      count: taskCounts.total,
      onClick: () => handleNav('tasks', 'All'),
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: Clock,
      count: taskCounts.pending,
      badgeColor: 'bg-amber-100 text-amber-800',
      onClick: () => handleNav('tasks', 'Pending'),
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      icon: Activity,
      count: taskCounts.inProgress,
      badgeColor: 'bg-sky-100 text-sky-800',
      onClick: () => handleNav('tasks', 'In Progress'),
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      count: taskCounts.completed,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      onClick: () => handleNav('tasks', 'Completed'),
    },
    {
      id: 'profile',
      label: 'Profile & Database',
      icon: User,
      onClick: () => handleNav('profile'),
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold shadow-xs">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900">TaskFlow</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  MERN
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Project Manager</p>
            </div>
          </div>

          <button
            id="sidebar-close-btn"
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 rounded-lg hover:bg-slate-100 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-4 pb-2">
          <button
            id="sidebar-add-task-btn"
            onClick={() => {
              onOpenCreateModal();
              onCloseMobile();
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-sm hover:shadow transition-all duration-150"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Task</span>
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentTab === item.id ||
              (item.id === 'pending' && currentTab === 'tasks-Pending') ||
              (item.id === 'in-progress' && currentTab === 'tasks-In Progress') ||
              (item.id === 'completed' && currentTab === 'tasks-Completed');

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={item.onClick}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {typeof item.count === 'number' && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-indigo-200/60 text-indigo-800' : 'bg-slate-100 text-slate-600')
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Database Status Indicator Card */}
        <div className="p-3 mx-3 mb-2 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              <span>Storage Mode</span>
            </div>
            <span
              className={`w-2 h-2 rounded-full ${
                dbStatus?.connected ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
              }`}
            />
          </div>
          <p className="text-[11px] font-medium text-slate-600 truncate">
            {dbStatus?.connected ? 'MongoDB Atlas / Connected' : 'Embedded Local Store (Active)'}
          </p>
        </div>

        {/* User Profile Footer */}
        <div className="p-3 border-t border-slate-200">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || ''}</p>
              </div>
            </div>

            <button
              id="sidebar-logout-btn"
              onClick={logout}
              title="Log out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

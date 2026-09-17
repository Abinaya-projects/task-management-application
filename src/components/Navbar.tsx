import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import {
  Menu,
  Plus,
  RefreshCw,
  Database,
  Search,
} from 'lucide-react';

interface NavbarProps {
  pageTitle: string;
  onOpenMobileMenu: () => void;
  onOpenCreateModal: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onSearchFocus?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  pageTitle,
  onOpenMobileMenu,
  onOpenCreateModal,
  onRefresh,
  isRefreshing = false,
}) => {
  const { user, dbStatus } = useAuth();

  return (
    <header
      id="app-navbar"
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200"
    >
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          id="navbar-mobile-menu-btn"
          onClick={onOpenMobileMenu}
          className="p-2 text-slate-600 rounded-lg hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{pageTitle}</h1>
        </div>
      </div>

      {/* Right: Actions, Database Indicator, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* DB Connection Badge */}
        <div
          title={dbStatus?.mode || 'Database Mode'}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200 bg-slate-50 text-slate-700"
        >
          <Database className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-semibold">
            {dbStatus?.connected ? 'MongoDB Atlas' : 'Embedded DB'}
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              dbStatus?.connected ? 'bg-emerald-500' : 'bg-blue-500'
            }`}
          />
        </div>

        {/* Sync / Refresh Button */}
        <button
          id="navbar-refresh-btn"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh tasks data"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Refresh data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
        </button>

        {/* Create Task Button */}
        <button
          id="navbar-add-task-btn"
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 py-1.5 px-3 sm:px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Task</span>
          <span className="sm:hidden">Add</span>
        </button>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div
            title={user?.email}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs ring-2 ring-white"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

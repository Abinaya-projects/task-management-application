import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { ToastProvider, useToast } from './components/Toast.js';
import { Navbar } from './components/Navbar.js';
import { Sidebar } from './components/Sidebar.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { TasksPage } from './pages/TasksPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { TaskModal } from './components/TaskModal.js';
import { TaskDetailsModal } from './components/TaskDetailsModal.js';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.js';
import { Task, DashboardStats, TaskStatus, TaskPriority } from './types/index.js';
import { taskAPI } from './services/api.js';

function MainLayout() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { success, error, info } = useToast();

  // Navigation & Page State
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'tasks' | 'profile'>('dashboard');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Data State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Load Data
  const loadData = useCallback(async (showRefreshing = false) => {
    if (!isAuthenticated) return;
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoadingData(true);

    try {
      const [tasksRes, statsRes] = await Promise.all([
        taskAPI.getAll(),
        taskAPI.getStats(),
      ]);
      setTasks(tasksRes.tasks || []);
      setStats(statsRes.stats);

      // Seed initial tasks if user has none, to make college project demos shine immediately
      if ((tasksRes.tasks || []).length === 0) {
        await seedSampleTasks();
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      error(err.message || 'Failed to load task records');
    } finally {
      setIsLoadingData(false);
      setIsRefreshing(false);
    }
  }, [isAuthenticated, error]);

  // Initial sample tasks generator for college project demo
  const seedSampleTasks = async () => {
    try {
      const sampleTasks = [
        {
          title: 'Design Full-Stack Architecture Diagram',
          description: 'Document the Express API routes, Mongoose schemas, and React component tree for the college project report.',
          priority: 'High',
          status: 'Completed',
          dueDate: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          title: 'Implement JWT Authentication & Password Hashing',
          description: 'Setup bcryptjs salt rounds and jsonwebtoken bearer verification middleware for protected task endpoints.',
          priority: 'High',
          status: 'In Progress',
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        },
        {
          title: 'Prepare Database Schema for Viva Presentation',
          description: 'Review User and Task Mongoose schemas, indexes, and validation rules for final professor evaluation.',
          priority: 'Medium',
          status: 'Pending',
          dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        },
        {
          title: 'Write Comprehensive README & GitHub Documentation',
          description: 'Include setup instructions, API contracts, environment variable checklist, and deployment guidelines.',
          priority: 'Low',
          status: 'Pending',
          dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
        },
      ];

      for (const t of sampleTasks) {
        await taskAPI.create(t);
      }

      const [updatedTasks, updatedStats] = await Promise.all([
        taskAPI.getAll(),
        taskAPI.getStats(),
      ]);
      setTasks(updatedTasks.tasks || []);
      setStats(updatedStats.stats);
    } catch (err) {
      console.warn('Sample task seeding skipped:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  // Handlers
  const handleNavigate = (tab: string, status = 'All') => {
    if (tab === 'dashboard' || tab === 'tasks' || tab === 'profile') {
      setCurrentTab(tab);
      setStatusFilter(status);
    }
  };

  const handleCreateOrUpdateTask = async (data: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: string;
  }) => {
    if (taskToEdit) {
      // Update
      const res = await taskAPI.update(taskToEdit._id, data);
      success('Task updated successfully!');
      // Update local state
      setTasks((prev) =>
        prev.map((t) => (t._id === taskToEdit._id ? res.task : t))
      );
      if (selectedTaskDetails?._id === taskToEdit._id) {
        setSelectedTaskDetails(res.task);
      }
    } else {
      // Create
      const res = await taskAPI.create(data);
      success('New task created successfully!');
      setTasks((prev) => [res.task, ...prev]);
    }

    // Refresh stats
    try {
      const statsRes = await taskAPI.getStats();
      setStats(statsRes.stats);
    } catch {
      // ignore
    }
    setTaskToEdit(null);
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      const res = await taskAPI.update(task._id, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.task : t))
      );
      if (selectedTaskDetails?._id === task._id) {
        setSelectedTaskDetails(res.task);
      }
      success(`Marked as ${newStatus}`);

      // Refresh stats
      const statsRes = await taskAPI.getStats();
      setStats(statsRes.stats);
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskAPI.delete(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      if (selectedTaskDetails?._id === taskId) {
        setSelectedTaskDetails(null);
      }
      success('Task deleted successfully');

      // Refresh stats
      const statsRes = await taskAPI.getStats();
      setStats(statsRes.stats);
    } catch (err: any) {
      error(err.message || 'Failed to delete task');
    }
  };

  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  // Auth Gate
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Initializing TaskFlow...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authView === 'register') {
      return <RegisterPage onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onSwitchToRegister={() => setAuthView('register')} />;
  }

  const pageTitle =
    currentTab === 'dashboard'
      ? 'Dashboard'
      : currentTab === 'tasks'
      ? 'All Tasks'
      : 'User Profile & Settings';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={
          currentTab === 'tasks' && statusFilter !== 'All'
            ? `tasks-${statusFilter}`
            : currentTab
        }
        onNavigate={handleNavigate}
        onOpenCreateModal={openCreateModal}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        taskCounts={{
          total: stats?.total || tasks.length,
          pending: stats?.pending || 0,
          inProgress: stats?.inProgress || 0,
          completed: stats?.completed || 0,
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Navbar
          pageTitle={pageTitle}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenCreateModal={openCreateModal}
          onRefresh={() => loadData(true)}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage
              stats={stats}
              isLoading={isLoadingData}
              onNavigateToTasks={(status) => handleNavigate('tasks', status)}
              onOpenCreateModal={openCreateModal}
              onEditTask={openEditModal}
              onDeleteTask={(t) => setTaskToDelete(t)}
              onViewTaskDetails={(t) => setSelectedTaskDetails(t)}
              onStatusChange={handleStatusChange}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksPage
              tasks={tasks}
              isLoading={isLoadingData}
              onOpenCreateModal={openCreateModal}
              onEditTask={openEditModal}
              onDeleteTask={(t) => setTaskToDelete(t)}
              onViewTaskDetails={(t) => setSelectedTaskDetails(t)}
              onStatusChange={handleStatusChange}
              initialStatusFilter={statusFilter}
            />
          )}

          {currentTab === 'profile' && <ProfilePage />}
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSubmit={handleCreateOrUpdateTask}
        taskToEdit={taskToEdit}
      />

      <TaskDetailsModal
        task={selectedTaskDetails}
        isOpen={!!selectedTaskDetails}
        onClose={() => setSelectedTaskDetails(null)}
        onEdit={(t) => {
          setSelectedTaskDetails(null);
          openEditModal(t);
        }}
        onDelete={(t) => {
          setSelectedTaskDetails(null);
          setTaskToDelete(t);
        }}
        onStatusChange={handleStatusChange}
      />

      <DeleteConfirmModal
        task={taskToDelete}
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ToastProvider>
  );
}

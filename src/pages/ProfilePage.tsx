import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../components/Toast.js';
import {
  User,
  Mail,
  Lock,
  Database,
  Key,
  ShieldCheck,
  CheckCircle2,
  Server,
  FolderGit2,
  Download,
  AlertCircle,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, dbStatus, refreshDBStatus } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Name cannot be empty');
      return;
    }
    setIsUpdatingProfile(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      success('Profile updated successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      error('Please enter your current password');
      return;
    }
    if (newPassword.length < 6) {
      error('New password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      error('New password and confirm password do not match');
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updateProfile({ currentPassword, newPassword });
      success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      error(err.message || 'Failed to change password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div id="profile-page" className="space-y-6 max-w-5xl pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Profile & System Settings
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Manage your account credentials, security settings, and inspect system architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile Card & Database Info */}
        <div className="space-y-5">
          {/* User Info Card */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-indigo-100 text-indigo-700 font-extrabold text-2xl flex items-center justify-center ring-4 ring-indigo-50">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="text-base font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-500 mb-4">{user?.email}</p>

            <div className="pt-4 border-t border-slate-100 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">User Role:</span>
                <span className="font-semibold text-slate-700 capitalize">{user?.role || 'Student'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Auth Provider:</span>
                <span className="font-semibold text-indigo-600">JWT (JSON Web Token)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">Password Hashing:</span>
                <span className="font-semibold text-emerald-600">bcrypt (10 rounds)</span>
              </div>
            </div>
          </div>

          {/* Database Architecture Card */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Database Status
                </h4>
              </div>
              <button
                onClick={refreshDBStatus}
                className="text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                Check
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">Current Mode:</span>
                <span className="font-bold text-slate-800">{dbStatus?.mode || 'Active'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">MongoDB Driver:</span>
                <span className="font-semibold text-emerald-700">Mongoose ODM</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">Connection State:</span>
                <span
                  className={`inline-flex items-center gap-1 font-semibold text-xs ${
                    dbStatus?.connected ? 'text-emerald-600' : 'text-blue-600'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      dbStatus?.connected ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}
                  />
                  {dbStatus?.connected ? 'MongoDB Live' : 'Embedded Local Store'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              💡 For college evaluations, this project includes both <strong>real Mongoose schemas</strong> for MongoDB Atlas / local MongoDB, and an instant local storage fallback so it runs immediately out of the box with zero external configuration!
            </p>
          </div>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Form */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <User className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">General Information</h3>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 outline-hidden transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 outline-hidden transition-all"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {isUpdatingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>

          {/* Security & Password Form */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Lock className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Change Password</h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 outline-hidden transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 outline-hidden transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 outline-hidden transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>

          {/* College Project Guide Card */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white tracking-tight">
                College Project Submission & GitHub Guide
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This application is built with clean, modular MERN architecture. To export the project:
            </p>

            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Use the <strong>Settings Menu</strong> at top-right of AI Studio to <strong>Export to ZIP</strong> or <strong>Push to GitHub</strong>.</li>
              <li>When running locally: clone repo, copy <code className="text-indigo-300">.env.example</code> to <code className="text-indigo-300">.env</code>, run <code className="text-indigo-300">npm install</code>, then <code className="text-indigo-300">npm run dev</code>.</li>
              <li>Read the included <code className="text-indigo-300">README.md</code> for complete API testing instructions and viva defense talking points!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

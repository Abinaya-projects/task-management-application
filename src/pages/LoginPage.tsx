import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { CheckSquare, Mail, Lock, LogIn, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const { login, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      await login({ email, password });
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Demo Login for college viva / project evaluation
  const handleDemoLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const demoEmail = 'student@college.edu';
    const demoPass = 'password123';
    try {
      await login({ email: demoEmail, password: demoPass });
    } catch {
      // If demo account doesn't exist yet, automatically register it on the fly!
      try {
        await register({
          name: 'Alex Rivera (Demo Student)',
          email: demoEmail,
          password: demoPass,
        });
      } catch (err2: any) {
        setErrorMsg(err2.message || 'Could not log in to demo account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="login-view"
      className="min-h-screen flex items-center justify-center p-4 bg-slate-50"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200/80 p-8 sm:p-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 mb-2">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome to TaskFlow
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Full-Stack College Task Management Application
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            id="login-error-alert"
            className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@college.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-900 placeholder:text-slate-400 outline-hidden transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-900 placeholder:text-slate-400 outline-hidden transition-all"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-60"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Login Shortcut Button */}
        <div className="pt-2 border-t border-slate-100">
          <button
            id="login-demo-btn"
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors border border-slate-200"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>1-Click Demo Student Login</span>
          </button>
          <p className="text-[11px] text-center text-slate-400 mt-1.5">
            Quickly test the project with a pre-configured student profile
          </p>
        </div>

        {/* Switch to Register */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <button
              id="switch-to-register-btn"
              onClick={onSwitchToRegister}
              className="font-bold text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-0.5"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

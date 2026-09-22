'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAdminAuth();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!credential.trim()) {
      setLocalError('Email, username, or phone required');
      return;
    }

    if (!password.trim()) {
      setLocalError('Password required');
      return;
    }

    const result = await login(credential, password);

    if (result.success) {
      router.push('/admin/dashboard');
    } else {
      setLocalError(result.error || 'Login failed');
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-800 to-slate-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl mb-4 shadow-xl">
            <span className="text-3xl">💊</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Dawai</h1>
          <p className="text-teal-200 font-medium">Admin Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-teal-100 text-sm mb-6">Sign in to manage your medicines</p>

          {/* Error Alert */}
          {displayError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
              <p className="text-red-200 text-sm font-medium">⚠️ {displayError}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Credential Input */}
            <div>
              <label htmlFor="credential" className="block text-sm font-semibold text-teal-100 mb-2">
                Email or Phone
              </label>
              <input
                id="credential"
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                placeholder="admin@dawai.com"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-teal-300/50 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/50 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-teal-100 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-teal-300/50 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/50 disabled:bg-white/5 disabled:cursor-not-allowed transition-all duration-200 pr-10 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-300 hover:text-teal-200 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                defaultChecked
                className="w-4 h-4 bg-white/10 border-white/20 rounded text-teal-400 focus:ring-teal-500"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-teal-100">
                Keep me logged in
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:cursor-not-allowed shadow-lg hover:shadow-teal-500/50 transform hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⚙️</span>
                  Logging in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-2 text-sm text-teal-300">or</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-center">
            <Link
              href="/admin/forgot-password"
              className="text-teal-300 hover:text-teal-200 text-sm font-medium transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-gradient-to-r from-teal-500/20 to-blue-500/20 border border-teal-400/30 rounded-xl p-5 backdrop-blur-sm">
          <p className="text-sm text-teal-100">
            <span className="font-bold text-teal-300 block mb-2">📋 Demo Credentials</span>
            <span className="text-teal-200">Email: </span>
            <code className="bg-black/30 px-2 py-1 rounded text-teal-300 font-mono text-xs">admin@dawai.com</code>
            <br className="mt-2" />
            <span className="text-teal-200">Password: </span>
            <code className="bg-black/30 px-2 py-1 rounded text-teal-300 font-mono text-xs">admin123</code>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-teal-200 text-sm mt-6">
          Not an admin?{' '}
          <Link href="/" className="text-teal-300 hover:text-teal-200 font-bold transition-colors">
            Go to customer site →
          </Link>
        </p>
      </div>
    </div>
  );
}

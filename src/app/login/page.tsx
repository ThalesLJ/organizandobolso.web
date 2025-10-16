'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
 
import Link from 'next/link';
import { SocialLinks } from '@/components';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(formData);
      } else {
        await register({ ...formData, email });
      }
      router.push('/home');
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-start justify-center px-4 pt-48 pb-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight select-none">
            Organizando Bolso
          </h1>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 shadow-2xl border border-white/10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-3 select-none">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                autoComplete="username"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-3 select-none">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-3 select-none">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || loading ? 'Signing in...' : (isLogin ? 'Sign in' : 'Create account')}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium select-none"
              >
                Forgot password?
              </Link>
            </div>

            <div className="text-center">
              <span className="text-sm text-slate-400 select-none">
                Don&apos;t have an account?{" "}
                <Link
                  href="/create-account"
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 select-none"
                >
                  Create account
                </Link>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}

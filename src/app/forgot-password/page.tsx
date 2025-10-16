"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";

type Step = 'email' | 'reset';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const secretRef = useRef<string>('');
  if (secretRef.current === '') {
    const bytes = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    }
    secretRef.current = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const codeValid = useMemo(() => /^\d{6}$/.test(code), [code]);
  const passwordsValid = useMemo(() => password.length >= 6 && password === confirmPassword, [password, confirmPassword]);

  const handleSendCode = async () => {
    if (!emailValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const resp = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!resp.ok) {
        throw new Error('Failed to send code');
      }
      setStep('reset');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyAndReset = async () => {
    if (!codeValid || !passwordsValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const resp = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, password }),
      });
      if (!resp.ok) {
        throw new Error('Verification failed');
      }
      window.location.href = '/login';
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Verification failed');
      setSubmitting(false);
      return;
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!passwordsValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 600));
      window.location.href = '/login';
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-start justify-center px-4 pt-48 pb-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Forgot Password
          </h1>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 shadow-2xl border border-white/10">
          {step === 'email' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-3">
                  Email Address
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

              <div className="bg-purple-900/20 border border-purple-800/50 rounded-xl p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-purple-300">
                      We&apos;ll send a 6-digit code to your email to verify your identity.
                    </p>
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="button"
                onClick={handleSendCode}
                disabled={!emailValid || submitting}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Sending...' : 'Send code'}
              </button>
            </div>
          )}

          {step === 'reset' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-3">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  inputMode="numeric"
                  pattern="\\d{6}"
                  maxLength={6}
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm tracking-widest text-center"
                  placeholder="Enter the 6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  autoComplete="one-time-code"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-3">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-3">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              {!passwordsValid && (password || confirmPassword) && (
                <p className="text-sm text-red-400">Passwords must match and be at least 6 characters.</p>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="button"
                onClick={handleVerifyAndReset}
                disabled={!passwordsValid || !codeValid || submitting}
                className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500/50 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : 'Save new password'}
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <span className="text-sm text-slate-400">
              Remember your password?{" "}
              <Link
                href="/login"
                prefetch={false}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200"
              >
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

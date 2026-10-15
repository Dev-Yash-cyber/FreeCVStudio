import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.js';
import { Footer } from '../components/layout/Footer.js';
import { Mail, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <div className="max-w-md w-full mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200/80 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Password Recovery</h1>
            <p className="text-xs text-slate-500">
              Enter your registered email address to receive password reset guidance.
            </p>
          </div>

          {submitted ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Recovery Instructions Sent</span>
              </div>
              <p>
                If an account exists for <span className="font-semibold">{email}</span>, password reset instructions have been generated.
              </p>
              <div className="pt-2">
                <Link to="/login" className="text-blue-600 font-bold hover:underline">
                  Return to login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Send Recovery Link
              </button>

              <div className="text-center text-xs text-slate-500 pt-2">
                Remember your password?{' '}
                <Link to="/login" className="font-bold text-blue-600 hover:underline">
                  Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

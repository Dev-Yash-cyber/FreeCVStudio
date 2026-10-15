import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js';
import {
  FileText,
  LayoutDashboard,
  User,
  LogOut,
  Settings,
  CheckCircle,
  Menu,
  X,
  Play,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleDemoClick = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err) {
      console.error('Demo login error', err);
    }
  };

  return (
    <nav className="border-b border-slate-200/80 bg-white/85 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                FreeCV<span className="text-blue-600 font-semibold">Studio</span>
              </span>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              100% Free Forever
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-[13px] font-medium text-slate-600">
            <Link to="/features" className="hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link to="/templates" className="hover:text-blue-600 transition-colors">
              Templates
            </Link>
            <Link
              to="/jd-matcher"
              className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <span>JD Matcher</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200/70 rounded-full">
                New
              </span>
            </Link>
            <Link to="/career-tools" className="hover:text-blue-600 transition-colors">
              Career Tools
            </Link>
            <Link to="/applications" className="hover:text-blue-600 transition-colors">
              Job Tracker
            </Link>
          </div>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition shadow-2xs"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {/* User menu dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500/20 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-52 rounded-2xl shadow-xl bg-white border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/settings/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" /> Profile Settings
                      </Link>
                      <Link
                        to="/settings/preferences"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" /> Preferences
                      </Link>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 w-full text-left transition"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500" /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleDemoClick}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 transition"
                  title="Test-drive all features with pre-populated sample data"
                >
                  <Play className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                  Explore Demo
                </button>
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-xs hover:shadow transition"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              to="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Features
            </Link>
            <Link
              to="/templates"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Templates
            </Link>
            <Link
              to="/jd-matcher"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              <span>JD Matcher</span>
              <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                New
              </span>
            </Link>
            <Link
              to="/career-tools"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Career Tools
            </Link>
            <Link
              to="/applications"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Job Tracker
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-xs"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="w-full text-center py-2 rounded-xl text-red-600 text-xs font-semibold hover:bg-red-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleDemoClick();
                  }}
                  className="w-full text-center py-2 rounded-xl text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-semibold"
                >
                  Explore Instant Demo
                </button>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

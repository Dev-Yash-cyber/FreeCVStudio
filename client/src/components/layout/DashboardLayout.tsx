import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.js';
import {
  FileText,
  Mail,
  Kanban,
  Wrench,
  LayoutDashboard,
  Settings,
  LogOut,
  Plus,
  Shield,
  Target,
} from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Resumes', href: '/resumes', icon: FileText },
    { label: 'Cover Letters', href: '/cover-letters', icon: Mail },
    { label: 'Job Tracker', href: '/applications', icon: Kanban },
    { label: 'JD Matcher', href: '/jd-matcher', icon: Target },
    { label: 'Career Tools', href: '/career-tools', icon: Wrench },
    { label: 'Settings', href: '/settings/profile', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Brand */}
        <div className="p-5 border-b flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              FreeCV <span className="text-blue-600 font-semibold">Studio</span>
            </span>
          </Link>
        </div>

        {/* Action Button */}
        <div className="p-4">
          <Link
            to="/resumes/new"
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.href ||
              (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Free policy reminder */}
        <div className="p-4 m-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-[11px] text-emerald-800">
          <div className="flex items-center gap-1.5 font-bold mb-0.5">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            100% Free Account
          </div>
          <p className="text-emerald-700 text-[10px] leading-tight">
            Unlimited resumes, downloads, and career tools. No subscriptions ever.
          </p>
        </div>

        {/* User bar */}
        <div className="p-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-slate-800 truncate">{user?.name || 'User'}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="text-slate-400 hover:text-red-500 p-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
};

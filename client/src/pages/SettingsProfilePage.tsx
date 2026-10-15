import React, { useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { api } from '../services/api.js';
import { User, CheckCircle2 } from 'lucide-react';

export const SettingsProfilePage: React.FC = () => {
  const { user, login, token } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.updateProfile({ name });
      if (res.user && token) {
        login(token, res.user);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-xs text-slate-500">Manage your basic account identity and contact address.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-5">
          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3 py-2 border rounded-xl bg-slate-100 text-slate-500 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Email address cannot be changed directly.</span>
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

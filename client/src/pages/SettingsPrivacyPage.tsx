import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { api } from '../services/api.js';
import { Shield, Download, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const SettingsPrivacyPage: React.FC = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleExportData = async () => {
    setExporting(true);
    try {
      const data = await api.exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `freecv-studio-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        'WARNING: This will permanently delete your account, all resumes, cover letters, and application tracker records. This action cannot be undone. Are you sure?'
      )
    )
      return;

    setDeleting(true);
    try {
      await api.deleteAccount();
      logout();
      navigate('/');
    } catch (err) {
      console.error(err);
      setDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Privacy & Data Management</h1>
          <p className="text-xs text-slate-500">You maintain 100% ownership of your resume records and data.</p>
        </div>

        {/* Data Ownership Card */}
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>GDPR & Data Ownership Policy</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            FreeCV Studio does not sell, broker, or monetize your resume data or job application histories. All documents are stored under your private account identity.
          </p>

          <div className="border-t pt-4">
            <h3 className="font-bold text-slate-900 mb-1">Export Complete User Archive</h3>
            <p className="text-slate-500 text-[11px] mb-3">
              Download a machine-readable JSON copy of all your resumes, cover letters, job applications, and profile settings.
            </p>
            <button
              type="button"
              onClick={handleExportData}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition"
            >
              <Download className="w-4 h-4" />
              <span>{exporting ? 'Generating JSON...' : 'Export All Account Data (JSON)'}</span>
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-200 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-red-900 text-sm flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Danger Zone
          </h3>
          <p className="text-red-700 leading-relaxed text-[11px]">
            Permanently delete your account and all associated documents from our MongoDB database. This action is immediate and irrevocable.
          </p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-sm"
          >
            {deleting ? 'Deleting Account...' : 'Permanently Delete My Account'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

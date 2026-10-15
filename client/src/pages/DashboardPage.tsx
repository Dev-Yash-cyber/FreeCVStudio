import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { api } from '../services/api.js';
import {
  FileText,
  Mail,
  Kanban,
  Plus,
  Upload,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle,
  MoreVertical,
  Trash2,
  Copy,
  ExternalLink,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<any[]>([]);
  const [coverLetters, setCoverLetters] = useState<any[]>([]);
  const [appStats, setAppStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [resumesRes, lettersRes, statsRes] = await Promise.all([
        api.getResumes({ sort: 'updatedAt', order: 'desc' }),
        api.getCoverLetters(),
        api.getApplicationStats(),
      ]);
      setResumes(resumesRes.resumes || []);
      setCoverLetters(lettersRes.coverLetters || []);
      setAppStats(statsRes.stats || null);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateResume = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.duplicateResume(id);
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResume = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.deleteResume(id);
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8 rounded-2xl text-white shadow-xl shadow-blue-500/10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" /> FreeCV Studio Workspace
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Welcome, {user?.name || 'Professional'}!
            </h1>
            <p className="text-blue-100 text-xs md:text-sm mt-1 max-w-xl">
              All features, 15 original templates, unlimited versions, and vector PDF exports are 100% free with your account.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/resumes/new"
              className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Resume</span>
            </Link>
            <Link
              to="/cover-letters"
              className="px-4 py-2.5 bg-blue-500/40 hover:bg-blue-500/60 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4" />
              <span>Cover Letters</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Resumes</span>
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{resumes.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Unlimited Free</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Cover Letters</span>
              <Mail className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{coverLetters.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Synced with Resumes</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Job Applications</span>
              <Kanban className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{appStats?.total || 0}</div>
            <div className="text-[11px] text-slate-500">{appStats?.active || 0} active stages</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Interviews</span>
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{appStats?.upcomingInterviews || 0}</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Upcoming Scheduled</div>
          </div>
        </div>

        {/* Recently Edited Resumes Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Resumes</h2>
              <p className="text-xs text-slate-500">Pick up where you left off or create a new targeted version.</p>
            </div>
            <Link
              to="/resumes"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All Resumes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">Loading your workspace...</div>
          ) : resumes.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-800">No resumes created yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Create your first professional resume in under five minutes with our live editor.
                </p>
              </div>
              <Link
                to="/resumes/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create My First Resume</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resumes.slice(0, 3).map((r) => (
                <div
                  key={r._id}
                  onClick={() => navigate(`/resumes/${r._id}/edit`)}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col justify-between group"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                        {r.templateId || 'ATS Professional'}
                      </span>
                      {r.atsScore && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ATS: {r.atsScore}/100
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition truncate">
                        {r.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {r.data?.personalInfo?.headline || 'Professional Profile'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Edited {new Date(r.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-slate-50 border-t flex justify-between items-center text-xs">
                    <span className="font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                      Open Editor <ArrowRight className="w-3 h-3" />
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleDuplicateResume(r._id, e)}
                        title="Duplicate"
                        className="p-1 text-slate-400 hover:text-slate-700"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteResume(r._id, e)}
                        title="Delete"
                        className="p-1 text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

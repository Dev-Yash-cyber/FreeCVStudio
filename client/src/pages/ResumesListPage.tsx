import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout.js';
import { api } from '../services/api.js';
import {
  FileText,
  Plus,
  Search,
  Copy,
  Trash2,
  Archive,
  Clock,
  ArrowRight,
  Filter,
  Grid,
  List,
} from 'lucide-react';

export const ResumesListPage: React.FC = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  useEffect(() => {
    loadResumes();
  }, [search]);

  const loadResumes = async () => {
    try {
      const res = await api.getResumes({ search });
      setResumes(res.resumes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.duplicateResume(id);
      loadResumes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this resume permanently?')) return;
    try {
      await api.deleteResume(id);
      loadResumes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">All Resumes</h1>
            <p className="text-xs text-slate-500">Create, customize, and organize unlimited resume versions.</p>
          </div>
          <Link
            to="/resumes/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Resume</span>
          </Link>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resumes by title..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-slate-600 ${viewMode === 'grid' ? 'bg-slate-100 font-bold' : ''}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-slate-600 ${viewMode === 'list' ? 'bg-slate-100 font-bold' : ''}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resumes List */}
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No resumes found</h3>
            <p className="text-xs text-slate-500">Get started by creating a new resume or importing an existing one.</p>
            <Link
              to="/resumes/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Resume
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resumes.map((r) => (
              <div
                key={r._id}
                onClick={() => navigate(`/resumes/${r._id}/edit`)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {r.templateId}
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
                      onClick={(e) => handleDuplicate(r._id, e)}
                      title="Duplicate"
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(r._id, e)}
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
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            {resumes.map((r) => (
              <div
                key={r._id}
                onClick={() => navigate(`/resumes/${r._id}/edit`)}
                className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{r.title}</h4>
                    <p className="text-[11px] text-slate-400">
                      {r.templateId} • Updated {new Date(r.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {r.atsScore && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      ATS: {r.atsScore}/100
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => handleDuplicate(r._id, e)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(r._id, e)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

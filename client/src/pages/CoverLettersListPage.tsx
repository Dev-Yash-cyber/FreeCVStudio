import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout.js';
import { api } from '../services/api.js';
import { Mail, Plus, Search, Trash2, Copy, ArrowRight, Clock } from 'lucide-react';

export const CoverLettersListPage: React.FC = () => {
  const [letters, setLetters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadLetters();
  }, [search]);

  const loadLetters = async () => {
    try {
      const res = await api.getCoverLetters(search);
      setLetters(res.coverLetters || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await api.createCoverLetter({
        title: 'New Cover Letter',
      });
      navigate(`/cover-letters/${res.coverLetter._id}/edit`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.duplicateCoverLetter(id);
      loadLetters();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Delete this cover letter?')) return;
    try {
      await api.deleteCoverLetter(id);
      loadLetters();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Cover Letters</h1>
            <p className="text-xs text-slate-500">Draft customized letters matching your resume style.</p>
          </div>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Cover Letter</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-3 rounded-xl border max-w-md">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cover letters..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-20 text-xs text-slate-400">Loading cover letters...</div>
        ) : letters.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <Mail className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No cover letters created yet</h3>
            <p className="text-xs text-slate-500">Create a tailored cover letter synchronized with your resume profile.</p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create First Cover Letter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {letters.map((letter) => (
              <div
                key={letter._id}
                onClick={() => navigate(`/cover-letters/${letter._id}/edit`)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition cursor-pointer overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-5 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700">
                    {letter.data?.companyName || 'Target Company'}
                  </span>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition truncate">
                      {letter.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                      Position: {letter.data?.jobTitle || 'General Application'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Edited {new Date(letter.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50 border-t flex justify-between items-center text-xs">
                  <span className="font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                    Open Editor <ArrowRight className="w-3 h-3" />
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleDuplicate(letter._id, e)}
                      title="Duplicate"
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(letter._id, e)}
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
    </DashboardLayout>
  );
};

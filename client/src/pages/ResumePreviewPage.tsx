import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { ResumeDocument } from '../components/templates/ResumeDocument.js';
import { ExportDropdown } from '../components/editor/ExportDropdown.js';
import { ChevronLeft, Edit3, ZoomIn, ZoomOut, Printer } from 'lucide-react';

export const ResumePreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (id) {
      api.getResume(id).then((res) => {
        setResume(res.resume);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading || !resume) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-xs text-slate-400">
        Loading document preview...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top action bar */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm no-print">
        <div className="flex items-center gap-3">
          <Link
            to={`/resumes/${id}/edit`}
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition flex items-center gap-1 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Editor
          </Link>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-xs text-slate-800 truncate max-w-xs">{resume.title}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg text-xs font-mono">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 hover:text-blue-600">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="p-1 hover:text-blue-600">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition flex items-center gap-1.5"
            title="Open browser print preview"
          >
            <Printer className="w-3.5 h-3.5" /> Print Preview
          </button>

          <Link
            to={`/resumes/${id}/edit`}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition flex items-center gap-1"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Resume
          </Link>
        </div>
      </header>

      {/* Centered Document */}
      <main className="flex-1 p-8 flex justify-center overflow-auto">
        <ResumeDocument data={resume.data} design={resume.design} zoom={zoom} />
      </main>
    </div>
  );
};

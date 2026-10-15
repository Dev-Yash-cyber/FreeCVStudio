import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore.js';
import { api } from '../../services/api.js';
import { Download, FileText, Printer, ChevronDown, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExportDropdown: React.FC = () => {
  const { resume } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  const handleExportPdf = async () => {
    if (!resume) return;
    setIsExporting(true);
    try {
      const blob = await api.exportResumePdf(resume.data, resume.design, resume.title);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(resume.title || 'Resume').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      confetti({ particleCount: 75, spread: 60, origin: { y: 0.8 } });
      setExportSuccess('PDF downloaded!');
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (err) {
      console.error('PDF export error:', err);
      // Fallback: trigger print dialog directly for reliable native PDF saving
      window.print();
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const handleExportDocx = async () => {
    if (!resume) return;
    setIsExporting(true);
    try {
      const blob = await api.exportResumeDocx(resume.data, resume.design, resume.title);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(resume.title || 'Resume').replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
      setExportSuccess('DOCX downloaded!');
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (err) {
      console.error('DOCX export error:', err);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const handlePrint = () => {
    setIsOpen(false);
    window.print();
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-sm transition"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{isExporting ? 'Generating...' : exportSuccess || 'Download / Print'}</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white border border-slate-100 z-50 py-1.5 focus:outline-none">
          <button
            onClick={handleExportPdf}
            className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
          >
            <div className="p-1.5 bg-red-50 text-red-600 rounded-md">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">PDF Document (.pdf)</div>
              <div className="text-[10px] text-slate-400">Watermark-free, vector typography</div>
            </div>
          </button>

          <button
            onClick={handleExportDocx}
            className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
          >
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Word Document (.docx)</div>
              <div className="text-[10px] text-slate-400">Editable Microsoft Word format</div>
            </div>
          </button>

          <div className="border-t my-1"></div>

          <button
            onClick={handlePrint}
            className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
          >
            <div className="p-1.5 bg-slate-100 text-slate-600 rounded-md">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Print Preview</div>
              <div className="text-[10px] text-slate-400">Direct browser print / save</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

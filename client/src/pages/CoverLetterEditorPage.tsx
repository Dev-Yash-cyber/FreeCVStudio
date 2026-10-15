import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import {
  Mail,
  ChevronLeft,
  Sparkles,
  Download,
  FileText,
  Printer,
  CheckCircle,
  Plus,
  Trash2,
  LayoutTemplate,
  Palette,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CoverLetterDocument } from '../components/coverLetter/CoverLetterTemplates.js';

export const CoverLetterEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [letter, setLetter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiDrafting, setAiDrafting] = useState(false);

  useEffect(() => {
    if (id) {
      api.getCoverLetter(id).then((res) => {
        setLetter(res.coverLetter);
        setLoading(false);
      });
    }
  }, [id]);

  const handleUpdateData = (field: string, val: any) => {
    if (!letter) return;
    const updated = {
      ...letter,
      data: { ...letter.data, [field]: val },
    };
    setLetter(updated);
    debouncedSave(updated);
  };

  const handleUpdateDesign = (field: string, val: any) => {
    if (!letter) return;
    const updated = {
      ...letter,
      design: { ...(letter.design || {}), [field]: val },
    };
    setLetter(updated);
    debouncedSave(updated);
  };

  let saveTimeout: any = null;
  const debouncedSave = (updatedLetter: any) => {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      setSaving(true);
      try {
        await api.updateCoverLetter(updatedLetter._id, {
          title: updatedLetter.title,
          data: updatedLetter.data,
          design: updatedLetter.design,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setSaving(false);
      }
    }, 1200);
  };

  const handleAddParagraph = () => {
    const paragraphs = [...(letter?.data?.bodyParagraphs || []), ''];
    handleUpdateData('bodyParagraphs', paragraphs);
  };

  const handleUpdateParagraph = (idx: number, text: string) => {
    const paragraphs = [...(letter?.data?.bodyParagraphs || [])];
    paragraphs[idx] = text;
    handleUpdateData('bodyParagraphs', paragraphs);
  };

  const handleDeleteParagraph = (idx: number) => {
    const paragraphs = (letter?.data?.bodyParagraphs || []).filter((_: any, i: number) => i !== idx);
    handleUpdateData('bodyParagraphs', paragraphs);
  };

  const handleAiDraft = async () => {
    setAiDrafting(true);
    try {
      const res = await api.draftCoverLetter({
        jobTitle: letter.data.jobTitle || 'Software Engineer',
        companyName: letter.data.companyName || 'Target Company',
        applicantName: letter.data.senderName || 'Applicant',
      });
      const updated = {
        ...letter,
        data: {
          ...letter.data,
          openingParagraph: res.opening,
          bodyParagraphs: res.body,
          closingParagraph: res.closing,
        },
      };
      setLetter(updated);
      debouncedSave(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setAiDrafting(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      const blob = await api.exportCoverLetterPdf(letter.data, letter.design, letter.title);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(letter.title || 'CoverLetter').replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      confetti({ particleCount: 50, spread: 60 });
    } catch (err) {
      window.print();
    }
  };

  const handleExportDocx = async () => {
    try {
      const blob = await api.exportCoverLetterDocx(letter.data, letter.design, letter.title);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(letter.title || 'CoverLetter').replace(/\s+/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      confetti({ particleCount: 50, spread: 60 });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !letter) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading cover letter editor...</div>;
  }

  const data = letter.data;
  const currentTemplate = letter.design?.templateId || 'modern-minimal';

  const templatesList = [
    { id: 'modern-minimal', name: 'Modern Minimal' },
    { id: 'executive-corporate', name: 'Executive Corporate' },
    { id: 'creative-accent', name: 'Creative Accent' },
    { id: 'classic-traditional', name: 'Classic Traditional' },
    { id: 'tech-contemporary', name: 'Tech Contemporary' },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 bg-white border-b px-4 flex items-center justify-between z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/cover-letters" className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <input
            type="text"
            value={letter.title}
            onChange={(e) => {
              setLetter({ ...letter, title: e.target.value });
              debouncedSave({ ...letter, title: e.target.value });
            }}
            className="font-bold text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1"
          />
          <span className="text-[11px] text-slate-400">
            {saving ? 'Saving...' : 'Saved'}
          </span>
        </div>

        {/* Center: Template Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <LayoutTemplate className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
          <span className="text-[11px] font-semibold text-slate-500">Template:</span>
          <select
            value={currentTemplate}
            onChange={(e) => handleUpdateDesign('templateId', e.target.value)}
            className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {templatesList.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAiDraft}
            disabled={aiDrafting}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{aiDrafting ? 'AI Drafting...' : 'AI Draft Letter'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={handleExportDocx}
            className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-1.5 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Word (.docx)</span>
          </button>
        </div>
      </header>

      {/* Editor & Preview Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form */}
        <div className="w-full md:w-1/2 bg-white border-r overflow-y-auto p-6 space-y-5">
          {/* Sender Details */}
          <div className="border-b pb-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Your Contact Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={data.senderName || ''}
                  onChange={(e) => handleUpdateData('senderName', e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-1.5 text-xs border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={data.senderTitle || ''}
                  onChange={(e) => handleUpdateData('senderTitle', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-3 py-1.5 text-xs border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email</label>
                <input
                  type="text"
                  value={data.senderEmail || ''}
                  onChange={(e) => handleUpdateData('senderEmail', e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone</label>
                <input
                  type="text"
                  value={data.senderPhone || ''}
                  onChange={(e) => handleUpdateData('senderPhone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Date</label>
                <input
                  type="text"
                  value={data.date || ''}
                  onChange={(e) => handleUpdateData('date', e.target.value)}
                  placeholder="October 15, 2026"
                  className="w-full px-2.5 py-1.5 text-xs border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Company & Recipient */}
          <div className="border-b pb-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Company & Target Job</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={data.companyName || ''}
                  onChange={(e) => handleUpdateData('companyName', e.target.value)}
                  placeholder="e.g. Stripe"
                  className="w-full px-3 py-1.5 text-xs border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={data.jobTitle || ''}
                  onChange={(e) => handleUpdateData('jobTitle', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full px-3 py-1.5 text-xs border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={data.recipientName || ''}
                  onChange={(e) => handleUpdateData('recipientName', e.target.value)}
                  placeholder="Hiring Manager"
                  className="w-full px-3 py-1.5 text-xs border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Salutation</label>
                <input
                  type="text"
                  value={data.salutation || ''}
                  onChange={(e) => handleUpdateData('salutation', e.target.value)}
                  placeholder="Dear Hiring Manager,"
                  className="w-full px-3 py-1.5 text-xs border rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Letter Content */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Opening Paragraph</label>
              <textarea
                rows={3}
                value={data.openingParagraph || ''}
                onChange={(e) => handleUpdateData('openingParagraph', e.target.value)}
                placeholder="State the role you are applying for and highlight your key enthusiasm..."
                className="w-full p-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            {/* Body Paragraphs */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-700">Body Paragraphs (Evidence & Impact)</label>
                <button
                  type="button"
                  onClick={handleAddParagraph}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  + Add Paragraph
                </button>
              </div>
              {(data.bodyParagraphs || []).map((bp: string, idx: number) => (
                <div key={idx} className="flex gap-2">
                  <textarea
                    rows={3}
                    value={bp}
                    onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                    placeholder="Elaborate on relevant projects, quantifiable impact, and alignment..."
                    className="flex-1 p-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 leading-relaxed"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteParagraph(idx)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Closing Paragraph</label>
              <textarea
                rows={3}
                value={data.closingParagraph || ''}
                onChange={(e) => handleUpdateData('closingParagraph', e.target.value)}
                placeholder="Reiterate your enthusiasm, propose an interview, and express gratitude..."
                className="w-full p-2.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sign-off</label>
                <input
                  type="text"
                  value={data.signOff || 'Sincerely,'}
                  onChange={(e) => handleUpdateData('signOff', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Document Preview */}
        <div className="hidden md:flex flex-1 bg-slate-200/70 p-8 overflow-auto justify-center items-start">
          <div
            id="cover-letter-printable"
            className="w-[210mm] min-h-[297mm] bg-white p-12 shadow-2xl relative select-text"
          >
            <CoverLetterDocument data={data} design={letter.design} />
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout.js';
import { api } from '../services/api.js';
import { FileText, UploadCloud, ArrowRight, Check, Sparkles } from 'lucide-react';

export const NewResumePage: React.FC = () => {
  const [title, setTitle] = useState('My Professional Resume');
  const [templateId, setTemplateId] = useState('ats-professional');
  const [templates, setTemplates] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);
  const [importing, setImporting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.getTemplates().then((res) => setTemplates(res.templates || []));
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await api.createResume({
        title,
        templateId,
        initialData: importedData,
      });
      navigate(`/resumes/${res.resume._id}/edit`);
    } catch (e) {
      console.error(e);
      setCreating(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setImporting(true);
    try {
      const res = await api.importFile(file);
      setImportedData(res.parsedData);
      if (res.parsedData?.personalInfo?.fullName) {
        setTitle(`${res.parsedData.personalInfo.fullName} - Resume`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Resume</h1>
          <p className="text-xs text-slate-500">Pick a starting template and customize it to perfection.</p>
        </div>

        {/* Step 1: Title & Optional Import */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Backend Engineer - Google"
              className="w-full px-3 py-2 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400">
              Give your resume a descriptive name to remember what roles you target.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-blue-600" />
              <span>Or Import from Existing File (Optional)</span>
            </label>
            <label className="border border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-3 flex items-center justify-center cursor-pointer transition bg-slate-50 text-center block">
              <input
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <span className="text-xs font-semibold text-slate-600">
                {importing
                  ? 'Extracting details...'
                  : importedData
                  ? '✓ Extracted successfully! Click to change'
                  : 'Upload PDF or Word to pre-fill'}
              </span>
            </label>
          </div>
        </div>

        {/* Step 2: Choose Template */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              2. Select a Starting Layout (15 Options Available)
            </h2>
            <span className="text-xs text-slate-400">You can switch templates anytime in the editor</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {templates.map((t) => (
              <div
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition text-left space-y-2 bg-white ${
                  templateId === t.id
                    ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="h-16 bg-slate-100 rounded-lg p-2 flex flex-col justify-between">
                  <div className="w-8 h-1.5 rounded" style={{ backgroundColor: t.colorScheme?.primary || '#2563eb' }} />
                  <div className="space-y-0.5">
                    <div className="h-1 w-full bg-slate-300 rounded" />
                    <div className="h-1 w-2/3 bg-slate-200 rounded" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900 truncate">{t.name}</span>
                    {templateId === t.id && <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-400 block">{t.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition flex items-center gap-2"
          >
            <span>{creating ? 'Creating Workspace...' : 'Open Resume Editor'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

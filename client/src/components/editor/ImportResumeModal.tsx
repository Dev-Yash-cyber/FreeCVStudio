import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore.js';
import { api } from '../../services/api.js';
import { UploadCloud, FileText, X, Check, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportResumeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { resume, setResume } = useResumeStore();
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsProcessing(true);
    setError(null);
    try {
      const res = await api.importFile(uploadedFile);
      setParsedPreview(res.parsedData);
    } catch (err: any) {
      setError(err.message || 'Failed to parse resume file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextParse = async () => {
    if (!pastedText.trim()) return;
    setIsProcessing(true);
    setError(null);
    try {
      const res = await api.importText(pastedText);
      setParsedPreview(res.parsedData);
    } catch (err: any) {
      setError(err.message || 'Failed to parse text.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = async () => {
    if (!parsedPreview || !resume) return;

    const mergedData = {
      ...resume.data,
      personalInfo: {
        ...resume.data.personalInfo,
        ...parsedPreview.personalInfo,
      },
      experience: parsedPreview.experience?.length ? parsedPreview.experience : resume.data.experience,
      education: parsedPreview.education?.length ? parsedPreview.education : resume.data.education,
      skillCategories: parsedPreview.skillCategories?.length ? parsedPreview.skillCategories : resume.data.skillCategories,
      projects: parsedPreview.projects?.length ? parsedPreview.projects : resume.data.projects,
      certifications: parsedPreview.certifications?.length ? parsedPreview.certifications : resume.data.certifications,
      customSections: parsedPreview.customSections?.length ? parsedPreview.customSections : resume.data.customSections,
      awards: parsedPreview.awards?.length ? parsedPreview.awards : resume.data.awards,
      volunteering: parsedPreview.volunteering?.length ? parsedPreview.volunteering : resume.data.volunteering,
      references: parsedPreview.references?.length ? parsedPreview.references : resume.data.references,
      interests: parsedPreview.interests?.length ? parsedPreview.interests : resume.data.interests,
    };

    setResume({
      ...resume,
      data: mergedData,
    });

    const store = useResumeStore.getState();
    store.pushHistory(mergedData);
    await store.saveResume();

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b pb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Import Existing Resume</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        {!parsedPreview && (
          <div className="flex border-b flex-shrink-0">
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-2 px-4 text-xs font-semibold border-b-2 transition ${
                activeTab === 'upload'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Upload PDF / Word (.docx)
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`pb-2 px-4 text-xs font-semibold border-b-2 transition ${
                activeTab === 'paste'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Paste Plain Text
            </button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex-shrink-0">
            {error}
          </div>
        )}

        {/* Content */}
        {!parsedPreview ? (
          <div className="py-2">
            {activeTab === 'upload' ? (
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50 hover:bg-blue-50/20 block text-center">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                  }}
                />
                <UploadCloud className="w-10 h-10 text-slate-400 mb-2" />
                <span className="text-xs font-bold text-slate-700">
                  {isProcessing ? 'Extracting Resume Text & Structure...' : 'Click or drag & drop PDF or DOCX file'}
                </span>
                <span className="text-[11px] text-slate-400 mt-1">Supports PDF & DOCX up to 10MB</span>
              </label>
            ) : (
              <div className="space-y-3">
                <textarea
                  rows={9}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your full resume text here (Contact, Experience, Education, Skills, Projects, Certificates)..."
                  className="w-full p-3 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleTextParse}
                  disabled={isProcessing || !pastedText.trim()}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition disabled:opacity-50"
                >
                  {isProcessing ? 'Analyzing Text...' : 'Extract & Parse Content'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 flex-1 overflow-hidden flex flex-col">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex-shrink-0">
              <span className="font-bold block mb-0.5">Resume Successfully Parsed!</span>
              We extracted all key sections from your document. Review the summary below and click "Import & Apply" to populate your resume editor.
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              {/* Personal Info */}
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">Personal Details</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-600">
                  <div><span className="font-medium text-slate-400">Name:</span> {parsedPreview.personalInfo?.fullName || '—'}</div>
                  <div><span className="font-medium text-slate-400">Headline:</span> {parsedPreview.personalInfo?.headline || '—'}</div>
                  <div><span className="font-medium text-slate-400">Email:</span> {parsedPreview.personalInfo?.email || '—'}</div>
                  <div><span className="font-medium text-slate-400">Phone:</span> {parsedPreview.personalInfo?.phone || '—'}</div>
                  <div><span className="font-medium text-slate-400">LinkedIn:</span> {parsedPreview.personalInfo?.linkedin || '—'}</div>
                  <div><span className="font-medium text-slate-400">GitHub:</span> {parsedPreview.personalInfo?.github || '—'}</div>
                </div>
                {parsedPreview.personalInfo?.summary && (
                  <p className="mt-2 text-slate-600 text-[11px] line-clamp-2">
                    <span className="font-medium text-slate-400">Summary:</span> {parsedPreview.personalInfo.summary}
                  </p>
                )}
              </div>

              {/* Work Experience */}
              {parsedPreview.experience && parsedPreview.experience.length > 0 && (
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-900">Work Experience</span>
                    <span className="text-[11px] text-blue-600 font-semibold">{parsedPreview.experience.length} Positions</span>
                  </div>
                  <div className="space-y-1.5">
                    {parsedPreview.experience.map((exp: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-baseline text-slate-700 bg-slate-50 px-2 py-1 rounded">
                        <div>
                          <span className="font-semibold text-slate-900">{exp.employer}</span>
                          <span className="text-slate-500"> — {exp.jobTitle}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {parsedPreview.education && parsedPreview.education.length > 0 && (
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-900">Education</span>
                    <span className="text-[11px] text-blue-600 font-semibold">{parsedPreview.education.length} Entries</span>
                  </div>
                  <div className="space-y-1.5">
                    {parsedPreview.education.map((edu: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-baseline text-slate-700 bg-slate-50 px-2 py-1 rounded">
                        <div>
                          <span className="font-semibold text-slate-900">{edu.institution}</span>
                          <span className="text-slate-500">, {edu.degree} {edu.fieldOfStudy ? `(${edu.fieldOfStudy})` : ''}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">{edu.startDate} – {edu.endDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Categories */}
              {parsedPreview.skillCategories && parsedPreview.skillCategories.length > 0 && (
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-900">Skills ({parsedPreview.skillCategories.length} Categories)</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    {parsedPreview.skillCategories.map((cat: any, idx: number) => (
                      <div key={idx}>
                        <span className="font-bold text-slate-800">{cat.categoryName}: </span>
                        <span className="text-slate-600">{cat.skills.map((s: any) => s.name).join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {parsedPreview.projects && parsedPreview.projects.length > 0 && (
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-900">Projects</span>
                    <span className="text-[11px] text-blue-600 font-semibold">{parsedPreview.projects.length} Projects</span>
                  </div>
                  <div className="space-y-1.5">
                    {parsedPreview.projects.map((proj: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 px-2 py-1 rounded">
                        <span className="font-semibold text-slate-900">{proj.name}</span>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <span className="text-slate-500 text-[11px] ml-2">[{proj.technologies.join(', ')}]</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {parsedPreview.certifications && parsedPreview.certifications.length > 0 && (
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-900">Certificates</span>
                    <span className="text-[11px] text-blue-600 font-semibold">{parsedPreview.certifications.length} Certifications</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    {parsedPreview.certifications.map((cert: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-baseline bg-slate-50 px-2 py-1 rounded">
                        <span className="font-semibold text-slate-900">{cert.name} — {cert.issuer}</span>
                        {cert.issueDate && <span className="text-slate-400">{cert.issueDate}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Sections / Languages */}
              {parsedPreview.customSections && parsedPreview.customSections.length > 0 && (
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  {parsedPreview.customSections.map((sec: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <span className="font-bold text-slate-900 block">{sec.sectionTitle}</span>
                      <div className="flex flex-wrap gap-2">
                        {sec.items.map((item: any, iIdx: number) => (
                          <span key={iIdx} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                            {item.title} {item.subtitle ? `(${item.subtitle})` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t flex-shrink-0">
              <button
                type="button"
                onClick={() => setParsedPreview(null)}
                className="flex-1 py-2 text-xs font-semibold border rounded-lg hover:bg-slate-50"
              >
                Upload Different File
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <span>Import & Apply to Resume</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout.js';
import { api } from '../services/api.js';
import {
  Target,
  FileText,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Copy,
  Check,
  Building2,
  Briefcase,
  AlertTriangle,
  Lightbulb,
  Zap,
  Sliders,
  ChevronDown,
} from 'lucide-react';

export const JdMatcherPage: React.FC = () => {
  // Input mode: 'saved' or 'paste'
  const [resumeMode, setResumeMode] = useState<'saved' | 'paste'>('saved');
  const [savedResumes, setSavedResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');

  // Form inputs
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('Senior Full Stack Engineer');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  // Analysis status & results
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [appliedNotice, setAppliedNotice] = useState('');

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const res = await api.getResumes();
      if (res.resumes && res.resumes.length > 0) {
        setSavedResumes(res.resumes);
        setSelectedResumeId(res.resumes[0]._id || res.resumes[0].id);
      }
    } catch (e) {
      console.error('Failed to load user resumes', e);
    }
  };

  const handleRunMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      alert('Please paste a job description to check your score.');
      return;
    }

    if (resumeMode === 'paste' && !resumeText.trim()) {
      alert('Please paste or write your resume details.');
      return;
    }

    if (resumeMode === 'saved' && !selectedResumeId) {
      alert('Please select a saved resume.');
      return;
    }

    setIsLoading(true);
    setAppliedNotice('');

    try {
      const payload: any = {
        jobDescription,
        jobTitle: jobTitle.trim() || undefined,
        company: company.trim() || undefined,
      };

      if (resumeMode === 'saved') {
        payload.resumeId = selectedResumeId;
      } else {
        payload.resumeText = resumeText;
      }

      const res = await api.matchJobDescription(payload);
      setReport(res.matchReport);
    } catch (err: any) {
      alert(err.message || 'Failed to analyze resume against job description.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToResume = async () => {
    if (!report?.tailoredSummary || !selectedResumeId) return;
    try {
      // Fetch selected resume
      const res = await api.getResume(selectedResumeId);
      const current = res.resume;
      if (current) {
        const updatedData = {
          ...current.data,
          personalInfo: {
            ...current.data.personalInfo,
            summary: report.tailoredSummary,
          },
        };
        await api.updateResume(selectedResumeId, {
          data: updatedData,
          atsScore: report.overallScore,
        });
        setAppliedNotice(`Tailored summary and ATS score (${report.overallScore}) applied directly to "${current.title}"!`);
      }
    } catch (err: any) {
      alert('Failed to apply to resume: ' + err.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <Target className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                JD Matcher & Resume Score Checker
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-emerald-200">
                100% Free
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Paste both your resume details and the target Job Description (JD) to evaluate your ATS match score, uncover missing keywords, and get tailored AI recommendations.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleRunMatch} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Resume Input */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    1. Resume Details
                  </h2>
                  <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setResumeMode('saved')}
                      className={`px-3 py-1 rounded-md transition ${
                        resumeMode === 'saved'
                          ? 'bg-white text-blue-600 shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Saved Resumes
                    </button>
                    <button
                      type="button"
                      onClick={() => setResumeMode('paste')}
                      className={`px-3 py-1 rounded-md transition ${
                        resumeMode === 'paste'
                          ? 'bg-white text-blue-600 shadow-xs font-bold'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Write / Paste Text
                    </button>
                  </div>
                </div>

                {resumeMode === 'saved' ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Select Resume from Your Account
                    </label>
                    {savedResumes.length > 0 ? (
                      <select
                        value={selectedResumeId}
                        onChange={(e) => setSelectedResumeId(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        {savedResumes.map((r) => (
                          <option key={r._id || r.id} value={r._id || r.id}>
                            {r.title} ({r.templateId || 'ATS Template'})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 text-center">
                        No saved resumes found. Switch to "Write / Paste Text" above to paste your resume content directly.
                      </div>
                    )}
                    <p className="text-[11px] text-slate-400">
                      The analyzer will parse your full structured experience, skills, projects, and summary.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Paste or Write Your Resume Content
                    </label>
                    <textarea
                      rows={10}
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your resume here (Summary, Work Experience, Technologies, Education, Certifications)..."
                      className="w-full p-3 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-800">
                💡 Tip: Resumes with quantifiable metrics (%, $, numbers) and technical keywords score 30% higher on ATS screeners.
              </div>
            </div>

            {/* Right Column: Job Description Input */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  2. Target Job Description (JD)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title</label>
                    <input
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full px-3 py-2 text-xs border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Stripe / Google / Linear"
                      className="w-full px-3 py-2 text-xs border rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Paste Job Description Text *
                  </label>
                  <textarea
                    rows={8}
                    required
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job posting text here (Requirements, responsibilities, tech stack, qualifications)..."
                    className="w-full p-3 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !jobDescription.trim()}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing Keywords & Calculating ATS Score...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    Check Resume Score as per JD
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Notice of applied changes */}
        {appliedNotice && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            {appliedNotice}
          </div>
        )}

        {/* RESULTS SECTION */}
        {report && (
          <div className="space-y-6 pt-4 animate-in fade-in duration-300">
            {/* Top Score Banner */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                  <Target className="w-3.5 h-3.5" />
                  ATS Match Evaluation
                </div>
                <h3 className="text-xl md:text-2xl font-black text-slate-900">
                  {report.matchGrade === 'A+' || report.matchGrade === 'A'
                    ? '🎉 Strong Match for this Position!'
                    : report.matchGrade === 'B'
                    ? '👍 Good Match with Keyword Optimization Needed'
                    : '⚠️ Moderate Match — Needs Alignment'}
                </h3>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  {report.verdict}
                </p>
              </div>

              {/* Radial / Large Score Badge */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/90 flex-shrink-0">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Overall Match
                  </span>
                  <div className="text-5xl font-black text-blue-600 tracking-tight my-0.5">
                    {report.overallScore}
                    <span className="text-xl text-slate-400 font-semibold">%</span>
                  </div>
                  <span className="inline-block bg-blue-600 text-white text-[11px] font-black px-3 py-0.5 rounded-full">
                    Grade {report.matchGrade}
                  </span>
                </div>
              </div>
            </div>

            {/* 4 Dimension Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Technical Skills Fit</span>
                <div className="text-2xl font-black text-slate-900">
                  {report.breakdown?.technicalSkillsScore}%
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${report.breakdown?.technicalSkillsScore}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Soft Skills & Leadership</span>
                <div className="text-2xl font-black text-slate-900">
                  {report.breakdown?.softSkillsScore}%
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{ width: `${report.breakdown?.softSkillsScore}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Experience & Impact</span>
                <div className="text-2xl font-black text-slate-900">
                  {report.breakdown?.experienceAlignmentScore}%
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full"
                    style={{ width: `${report.breakdown?.experienceAlignmentScore}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[11px] font-semibold text-slate-500 block">Education & Baseline</span>
                <div className="text-2xl font-black text-slate-900">
                  {report.breakdown?.educationFitScore}%
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-purple-600 h-1.5 rounded-full"
                    style={{ width: `${report.breakdown?.educationFitScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Keyword Matrix: Matched vs Missing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Keywords */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Matched Keywords ({report.keywords?.matched?.length || 0})
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Detected in Resume
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  These core requirements from the job description are already present in your resume.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {(report.keywords?.matched || []).map((kw: string) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Critical Keywords */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Missing Keywords ({report.keywords?.missing?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(report.keywords?.missing?.join(', ') || '');
                      alert('Missing keywords copied to clipboard!');
                    }}
                    className="text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-0.5 rounded-md transition flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy Keywords
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  These high-priority skills appear in the JD but were not detected in your resume.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {(report.keywords?.missing || []).map((kw: string) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 bg-rose-50 text-rose-800 text-xs font-bold rounded-lg border border-rose-200 flex items-center gap-1"
                    >
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tailored Professional Summary & Quick Apply */}
            {report.tailoredSummary && (
              <div className="bg-gradient-to-r from-purple-50/70 via-indigo-50/60 to-blue-50/70 p-6 rounded-3xl border border-purple-200/80 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        Tailored Professional Summary for this JD
                      </h4>
                      <p className="text-xs text-slate-500">
                        Engineered with target keywords to grab recruiter attention in under 6 seconds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(report.tailoredSummary);
                        alert('Summary copied to clipboard!');
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                    {resumeMode === 'saved' && selectedResumeId && (
                      <button
                        type="button"
                        onClick={handleApplyToResume}
                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                      >
                        <Check className="w-3.5 h-3.5" /> Apply to Resume
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border border-purple-100 text-xs text-slate-800 leading-relaxed font-medium italic">
                  "{report.tailoredSummary}"
                </div>
              </div>
            )}

            {/* Suggested Bullets Incorporating Missing Keywords */}
            {report.suggestedBullets && report.suggestedBullets.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Suggested Experience Bullets Tailored to this Role
                </h4>
                <p className="text-xs text-slate-500">
                  Ready-to-use bullet points that integrate the missing JD keywords with high-impact metrics.
                </p>

                <div className="space-y-2">
                  {report.suggestedBullets.map((bullet: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50/80 border border-slate-200/90 rounded-xl text-xs text-slate-800 flex items-start justify-between gap-3 hover:border-blue-300 transition"
                    >
                      <p className="flex-1 leading-relaxed">
                        <span className="font-bold text-blue-600 mr-2">•</span>
                        {bullet}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(bullet);
                          alert('Bullet copied to clipboard!');
                        }}
                        className="p-1 text-slate-400 hover:text-slate-800"
                        title="Copy bullet"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations List */}
            {report.recommendations && report.recommendations.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  Key Action Items to Maximize Your Interview Rate
                </h4>

                <div className="space-y-3">
                  {report.recommendations.map((rec: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            rec.priority === 'high'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {rec.priority} priority
                        </span>
                        <span className="text-xs font-bold text-slate-900">{rec.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore.js';
import { api } from '../../services/api.js';
import {
  Languages,
  PenLine,
  FileText,
  Sparkles,
  SpellCheck,
  CheckCircle,
  Copy,
  ChevronRight,
  Target,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  RefreshCw,
  Sliders,
} from 'lucide-react';

interface Props {
  onOpenJdMatcher?: () => void;
}

export const AiToolsPanel: React.FC<Props> = ({ onOpenJdMatcher }) => {
  const { resume, setResume, saveResume } = useResumeStore();

  // Active Tool Modal states
  const [activeModal, setActiveModal] = useState<
    'translate' | 'improve' | 'cover_letter' | 'summary' | 'grammar' | 'jd_matcher' | null
  >(null);

  // Translation State
  const [targetLang, setTargetLang] = useState('es');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationSuccess, setTranslationSuccess] = useState('');

  // Improve Writing State
  const [textToImprove, setTextToImprove] = useState('');
  const [improveTone, setImproveTone] = useState<'professional' | 'executive' | 'concise' | 'technical'>('executive');
  const [improvedSuggestions, setImprovedSuggestions] = useState<string[]>([]);
  const [isImproving, setIsImproving] = useState(false);

  // Cover Letter State
  const [clJobTitle, setClJobTitle] = useState('Senior Full Stack Engineer');
  const [clCompany, setClCompany] = useState('Google');
  const [clGenerated, setClGenerated] = useState<any>(null);
  const [isDraftingCL, setIsDraftingCL] = useState(false);

  // Generate Summary State
  const [summarySuggestions, setSummarySuggestions] = useState<string[]>([]);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Grammar & Spelling State
  const [grammarIssues, setGrammarIssues] = useState<any[]>([]);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
  const [grammarVerdict, setGrammarVerdict] = useState('');

  // JD Matcher inline state
  const [jdText, setJdText] = useState('');
  const [jdTargetRole, setJdTargetRole] = useState('Senior Software Engineer');
  const [jdCompany, setJdCompany] = useState('');
  const [jdReport, setJdReport] = useState<any>(null);
  const [isMatchingJd, setIsMatchingJd] = useState(false);

  if (!resume) return null;

  // 1. Handle Translate
  const handleTranslate = async () => {
    setIsTranslating(true);
    setTranslationSuccess('');
    try {
      const res = await api.translateResume({
        resumeData: resume.data,
        targetLanguage: targetLang,
      });
      if (res.translatedData) {
        setResume({
          ...resume,
          data: res.translatedData,
        });
        saveResume();
        setTranslationSuccess(`Resume successfully translated into ${res.targetLanguageName}!`);
      }
    } catch (err: any) {
      alert(err.message || 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  // 2. Handle Improve Writing
  const handleImproveWriting = async () => {
    if (!textToImprove.trim()) return;
    setIsImproving(true);
    try {
      const res = await api.improveBullet({
        originalText: textToImprove,
        tone: improveTone,
        jobTitle: resume.data?.personalInfo?.headline || 'Professional',
      });
      setImprovedSuggestions(res.suggestions || []);
    } catch (err: any) {
      alert(err.message || 'Failed to improve text');
    } finally {
      setIsImproving(false);
    }
  };

  // 3. Handle Draft Cover Letter
  const handleDraftCoverLetter = async () => {
    setIsDraftingCL(true);
    try {
      const res = await api.draftCoverLetter({
        jobTitle: clJobTitle,
        companyName: clCompany,
        applicantName: resume.data?.personalInfo?.fullName || 'Applicant',
        skills: resume.data?.skillCategories?.flatMap((c) => c.skills.map((s) => s.name)) || [],
        keyAchievements: resume.data?.experience?.[0]?.bulletPoints || [],
      });
      setClGenerated(res);
    } catch (err: any) {
      alert(err.message || 'Failed to draft cover letter');
    } finally {
      setIsDraftingCL(false);
    }
  };

  // 4. Handle Generate Summary
  const handleGenerateSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const skills = resume.data?.skillCategories?.flatMap((c) => c.skills.map((s) => s.name)) || [];
      const res = await api.generateSummary({
        jobTitle: resume.data?.personalInfo?.headline || 'Senior Software Engineer',
        yearsOfExperience: 5,
        keySkills: skills.slice(0, 6),
      });
      setSummarySuggestions(res.summaries || []);
    } catch (err: any) {
      alert(err.message || 'Failed to generate summary');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // 5. Handle Check Grammar
  const handleCheckGrammar = async () => {
    setIsCheckingGrammar(true);
    try {
      const res = await api.checkGrammar({ resumeData: resume.data });
      setGrammarIssues(res.issues || []);
      setGrammarVerdict(res.verdict || '');
    } catch (err: any) {
      alert(err.message || 'Grammar check failed');
    } finally {
      setIsCheckingGrammar(false);
    }
  };

  // 6. Handle Match JD
  const handleMatchJd = async () => {
    if (!jdText.trim()) return;
    setIsMatchingJd(true);
    try {
      const res = await api.matchJobDescription({
        resumeId: resume._id,
        resumeData: resume.data,
        jobDescription: jdText,
        jobTitle: jdTargetRole,
        company: jdCompany,
      });
      setJdReport(res.matchReport);
    } catch (err: any) {
      alert(err.message || 'Failed to analyze job description');
    } finally {
      setIsMatchingJd(false);
    }
  };

  const applyTailoredSummaryToResume = (summaryText: string) => {
    setResume({
      ...resume,
      data: {
        ...resume.data,
        personalInfo: {
          ...resume.data.personalInfo,
          summary: summaryText,
        },
      },
    });
    saveResume();
    alert('Tailored summary applied to your resume and saved!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner - Free Policy (FlowCV Pro plan contrast) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              FreeCV AI Career Suite
              <span className="text-[10px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                100% Free Forever
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Every AI tool is unlocked with unlimited generations. No Pro subscriptions, credits, or paywalls.
            </p>
          </div>
        </div>
      </div>

      {/* Main Heading */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">What would you like to do?</h2>
        <p className="text-xs text-slate-500 mt-1">
          Select an AI assistant to enhance, translate, or tailor your resume to any job description.
        </p>
      </div>

      {/* Cards List Matching FlowCV Screenshot 2 */}
      <div className="space-y-3.5">
        {/* Card 1: Job Description Matcher (Featured!) */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/60 to-indigo-50/40 border-2 border-blue-200/90 hover:border-blue-400 hover:shadow-md transition bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900">Check Score as per Job Description</h3>
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Featured
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Paste any target Job Description to calculate your resume match score %, extract missing keywords, and generate tailored bullet points.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('jd_matcher')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex-shrink-0 text-center"
          >
            Match & Score now
          </button>
        </div>

        {/* Card 2: Translate Resume */}
        <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Translate resume</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Create a translated version of your resume in the language of your choice.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('translate')}
            className="px-5 py-2.5 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition flex-shrink-0 text-center"
          >
            Translate now
          </button>
        </div>

        {/* Card 3: Improve Writing */}
        <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <PenLine className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">Improve writing</h3>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  New
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Strengthen your resume with clearer, more concise and impactful writing.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              const sample = resume.data?.experience?.[0]?.bulletPoints?.[0] || resume.data?.personalInfo?.summary || '';
              setTextToImprove(sample);
              setActiveModal('improve');
            }}
            className="px-5 py-2.5 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition flex-shrink-0 text-center"
          >
            Improve now
          </button>
        </div>

        {/* Card 4: Draft Cover Letter */}
        <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">Draft Cover Letter</h3>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  New
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Draft a tailored cover letter draft based on your resume and target job description.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal('cover_letter')}
            className="px-5 py-2.5 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition flex-shrink-0 text-center"
          >
            Draft now
          </button>
        </div>

        {/* Card 5: Generate Summary */}
        <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">Generate Summary</h3>
                <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  New
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Turn your existing resume content into a professional summary for your resume.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveModal('summary');
              handleGenerateSummary();
            }}
            className="px-5 py-2.5 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition flex-shrink-0 text-center"
          >
            Generate now
          </button>
        </div>

        {/* Card 6: Check spelling & grammar */}
        <div className="p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <SpellCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Check spelling & grammar</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Check spelling, grammar and punctuation without rewriting.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveModal('grammar');
              handleCheckGrammar();
            }}
            className="px-5 py-2.5 border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl transition flex-shrink-0 text-center"
          >
            Check now
          </button>
        </div>
      </div>

      {/* --- MODAL 1: JD MATCH & ATS SCORE CHECKER --- */}
      {activeModal === 'jd_matcher' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">Match Resume with Job Description</h3>
                  <p className="text-xs text-slate-500">Calculate exact ATS score and identify missing keywords.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title</label>
                  <input
                    type="text"
                    value={jdTargetRole}
                    onChange={(e) => setJdTargetRole(e.target.value)}
                    placeholder="e.g. Senior Full Stack Engineer"
                    className="w-full px-3 py-2 text-xs border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Company (Optional)</label>
                  <input
                    type="text"
                    value={jdCompany}
                    onChange={(e) => setJdCompany(e.target.value)}
                    placeholder="e.g. Stripe / Google / Airbnb"
                    className="w-full px-3 py-2 text-xs border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Paste Target Job Description (JD) *
                </label>
                <textarea
                  rows={4}
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the full job description text here (requirements, qualifications, tech stack)..."
                  className="w-full p-3 text-xs border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleMatchJd}
                disabled={isMatchingJd || !jdText.trim()}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
              >
                {isMatchingJd ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing Resume Against Job Description...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4" />
                    Calculate Match Score & Keyword Gaps
                  </>
                )}
              </button>

              {jdReport && (
                <div className="space-y-5 pt-3 border-t border-slate-100 animate-in fade-in">
                  {/* Score overview */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                        JD Match Score
                      </span>
                      <p className="text-xs text-slate-600 mt-1 max-w-md">{jdReport.verdict}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-4xl font-black text-blue-700">
                        {jdReport.overallScore}%
                      </div>
                      <span className="inline-block bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5">
                        Grade {jdReport.matchGrade}
                      </span>
                    </div>
                  </div>

                  {/* Keywords breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Matched Keywords ({jdReport.keywords?.matched?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(jdReport.keywords?.matched || []).map((kw: string) => (
                          <span
                            key={kw}
                            className="bg-emerald-100 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-emerald-200"
                          >
                            ✓ {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                        <X className="w-4 h-4 text-rose-600" />
                        Missing Critical Keywords ({jdReport.keywords?.missing?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(jdReport.keywords?.missing || []).map((kw: string) => (
                          <span
                            key={kw}
                            className="bg-rose-100 text-rose-800 text-[11px] font-semibold px-2 py-0.5 rounded-lg border border-rose-200"
                          >
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tailored Summary */}
                  {jdReport.tailoredSummary && (
                    <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          Tailored Summary for this JD
                        </span>
                        <button
                          type="button"
                          onClick={() => applyTailoredSummaryToResume(jdReport.tailoredSummary)}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] rounded-lg transition"
                        >
                          Apply to Resume
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed italic">
                        "{jdReport.tailoredSummary}"
                      </p>
                    </div>
                  )}

                  {/* Suggested Bullets */}
                  {jdReport.suggestedBullets?.length > 0 && (
                    <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                      <span className="text-xs font-bold text-slate-900 block">
                        Suggested Bullets incorporating Missing Keywords
                      </span>
                      <ul className="space-y-1.5">
                        {jdReport.suggestedBullets.map((b: string, i: number) => (
                          <li
                            key={i}
                            className="text-xs text-slate-700 flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80"
                          >
                            <span className="text-blue-600 font-bold">•</span>
                            <span className="flex-1">{b}</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(b);
                                alert('Bullet copied to clipboard!');
                              }}
                              className="text-slate-400 hover:text-slate-700 p-1"
                              title="Copy bullet"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: TRANSLATE RESUME --- */}
      {activeModal === 'translate' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Languages className="w-4 h-4 text-blue-600" />
                Translate Resume
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select the language you want to translate your resume into. All sections and headlines will be adapted.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Language</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-xl bg-white"
              >
                <option value="es">Spanish (Español)</option>
                <option value="fr">French (Français)</option>
                <option value="de">German (Deutsch)</option>
                <option value="it">Italian (Italiano)</option>
                <option value="pt">Portuguese (Português)</option>
                <option value="ja">Japanese (日本語)</option>
                <option value="zh">Chinese (中文)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="ar">Arabic (العربية)</option>
              </select>
            </div>

            {translationSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                {translationSuccess}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Done
              </button>
              <button
                type="button"
                onClick={handleTranslate}
                disabled={isTranslating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                {isTranslating ? 'Translating...' : 'Translate & Apply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: IMPROVE WRITING --- */}
      {activeModal === 'improve' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-100 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b flex-shrink-0">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <PenLine className="w-4 h-4 text-purple-600" />
                Improve Writing with Power Verbs & Metrics
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Text or Bullet to Improve</label>
                <textarea
                  rows={3}
                  value={textToImprove}
                  onChange={(e) => setTextToImprove(e.target.value)}
                  placeholder="Paste or write any bullet point or summary..."
                  className="w-full p-2.5 text-xs border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tone & Focus</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['executive', 'technical', 'concise', 'professional'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setImproveTone(t)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border transition ${
                        improveTone === t
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleImproveWriting}
                disabled={isImproving || !textToImprove.trim()}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                {isImproving ? 'Generating Alternatives...' : 'Improve Now'}
              </button>

              {improvedSuggestions.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <span className="text-xs font-bold text-slate-900 block">AI Suggestions:</span>
                  {improvedSuggestions.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl text-xs text-slate-800 flex items-start justify-between gap-3"
                    >
                      <p className="flex-1 leading-relaxed">{s}</p>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(s);
                          alert('Copied to clipboard!');
                        }}
                        className="p-1 text-slate-400 hover:text-slate-800"
                        title="Copy"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: DRAFT COVER LETTER --- */}
      {activeModal === 'cover_letter' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-100 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b flex-shrink-0">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Draft Tailored Cover Letter
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title</label>
                  <input
                    type="text"
                    value={clJobTitle}
                    onChange={(e) => setClJobTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={clCompany}
                    onChange={(e) => setClCompany(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleDraftCoverLetter}
                disabled={isDraftingCL}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                {isDraftingCL ? 'Drafting Cover Letter...' : 'Draft Cover Letter Now'}
              </button>

              {clGenerated && (
                <div className="p-4 bg-slate-50 border rounded-2xl space-y-3 text-xs text-slate-800 leading-relaxed">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const full = `${clGenerated.opening}\n\n${clGenerated.body.join('\n\n')}\n\n${clGenerated.closing}`;
                        navigator.clipboard.writeText(full);
                        alert('Full cover letter copied to clipboard!');
                      }}
                      className="px-3 py-1 bg-white border text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy Letter
                    </button>
                  </div>
                  <p>{clGenerated.opening}</p>
                  {clGenerated.body?.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                  <p>{clGenerated.closing}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 5: GENERATE SUMMARY --- */}
      {activeModal === 'summary' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-100 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b flex-shrink-0">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Generate Professional Summary
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              <p className="text-xs text-slate-500">
                AI analyzed your experience and key technical skills to craft these 3 executive summaries:
              </p>

              {isGeneratingSummary ? (
                <div className="p-8 text-center text-xs text-slate-400">Crafting tailored summaries...</div>
              ) : (
                <div className="space-y-3">
                  {summarySuggestions.map((sum, i) => (
                    <div
                      key={i}
                      className="p-4 bg-purple-50/50 border border-purple-200/70 rounded-2xl space-y-3"
                    >
                      <p className="text-xs text-slate-800 leading-relaxed italic">"{sum}"</p>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(sum);
                            alert('Copied summary!');
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            applyTailoredSummaryToResume(sum);
                            setActiveModal(null);
                          }}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold"
                        >
                          Apply to Resume
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 6: CHECK GRAMMAR --- */}
      {activeModal === 'grammar' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-100 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b flex-shrink-0">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <SpellCheck className="w-4 h-4 text-emerald-600" />
                Spelling, Grammar & Voice Check
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {isCheckingGrammar ? (
                <div className="p-8 text-center text-xs text-slate-400">Scanning all resume sections...</div>
              ) : (
                <>
                  <div className="p-3 bg-slate-50 border rounded-xl text-xs font-medium text-slate-700">
                    {grammarVerdict}
                  </div>

                  {grammarIssues.length > 0 && (
                    <div className="space-y-2">
                      {grammarIssues.map((iss, i) => (
                        <div key={i} className="p-3 bg-rose-50/50 border border-rose-200/80 rounded-xl space-y-1">
                          <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                            {iss.field} • {iss.explanation}
                          </span>
                          <p className="text-xs text-slate-600 line-through">"{iss.original}"</p>
                          <p className="text-xs text-emerald-700 font-semibold">Suggested: "{iss.suggested}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

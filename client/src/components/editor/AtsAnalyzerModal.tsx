import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore.js';
import { api } from '../../services/api.js';
import { CheckCircle2, AlertTriangle, X, Search, FileText, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AtsAnalyzerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { resume } = useResumeStore();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [jobDescription, setJobDescription] = useState('');

  const runAnalysis = async () => {
    if (!resume) return;
    setLoading(true);
    try {
      const res = await api.analyzeAts({
        resumeId: resume._id,
        resumeData: resume.data,
        jobDescription: jobDescription.trim() || undefined,
      });
      setReport(res.report);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && resume) {
      runAnalysis();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">ATS Resume Scanner & Keyword Matcher</h2>
              <p className="text-xs text-slate-500">Explainable scoring based on industry recruiting filters.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Target Job Description Paste */}
          <div className="p-4 bg-slate-50 border rounded-xl space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Search className="w-4 h-4 text-blue-600" />
              Tailor to a Specific Job Description (Optional)
            </label>
            <div className="flex gap-2">
              <textarea
                rows={2}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to check missing keywords and ATS relevance..."
                className="flex-1 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={runAnalysis}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Scan Now'}
              </button>
            </div>
          </div>

          {report && (
            <div className="space-y-6">
              {/* Overall Score Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1">
                    Overall ATS Score
                  </span>
                  <div className="text-5xl font-black text-blue-700 my-1">
                    {report.overallScore}<span className="text-xl text-blue-500">/100</span>
                  </div>
                  <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full mt-1">
                    Grade {report.grade}
                  </span>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-3 p-4 bg-slate-50 border rounded-xl">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Strong Action Verbs</span>
                    <span className="text-xl font-bold text-slate-900">{report.metrics.actionVerbCount} found</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Measurable Metrics (%, $)</span>
                    <span className="text-xl font-bold text-slate-900">{report.metrics.quantifiableAchievementsCount} metrics</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Experience Bullets</span>
                    <span className="text-xl font-bold text-slate-900">{report.metrics.bulletCount}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Detected Keywords</span>
                    <span className="text-xl font-bold text-slate-900">{report.metrics.detectedKeywords?.length || 0} skills</span>
                  </div>
                </div>
              </div>

              {/* Component Breakdown Progress */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Score Breakdown
                </h3>
                <div className="space-y-2.5">
                  {Object.entries(report.breakdown || {}).map(([key, value]: any) => {
                    const label = key.replace('Score', '').replace(/([A-Z])/g, ' $1').trim();
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                          <span className="capitalize">{label}</span>
                          <span>{value}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Prioritized Recommendations
                </h3>
                {report.recommendations?.length === 0 ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Excellent work! Your resume passes standard ATS best practices with flying colors.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {report.recommendations.map((rec: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs flex gap-3 items-start ${
                          rec.priority === 'high'
                            ? 'bg-red-50/50 border-red-200 text-red-900'
                            : 'bg-amber-50/50 border-amber-200 text-amber-900'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold block">{rec.issue}</span>
                          <span className="text-slate-600 mt-0.5 block">{rec.suggestion}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
          >
            Close Scanner
          </button>
        </div>
      </div>
    </div>
  );
};

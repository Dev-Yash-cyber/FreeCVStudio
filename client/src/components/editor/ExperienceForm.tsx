import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore.js';
import { ExperienceItem } from '../../types/index.js';
import { Briefcase, Plus, Trash2, ChevronUp, ChevronDown, Sparkles, Building2 } from 'lucide-react';
import { api } from '../../services/api.js';
import { RichTextEditor } from './RichTextEditor.js';

export const ExperienceForm: React.FC = () => {
  const { resume, updateExperience } = useResumeStore();
  const experiences = resume?.data?.experience || [];

  const [aiBulletModal, setAiBulletModal] = useState<{
    expIndex: number;
    bulletIndex: number;
    original: string;
    suggestions: string[];
  } | null>(null);

  const [improving, setImproving] = useState(false);

  const handleAddExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      jobTitle: '',
      employer: '',
      employmentType: 'Full-time',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      responsibilities: '',
      bulletPoints: [''],
      technologies: [],
    };
    updateExperience([...experiences, newItem]);
  };

  const handleUpdateItem = (index: number, updates: Partial<ExperienceItem>) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], ...updates };
    updateExperience(updated);
  };

  const handleDeleteItem = (index: number) => {
    const updated = experiences.filter((_, i) => i !== index);
    updateExperience(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === experiences.length - 1)
    )
      return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...experiences];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    updateExperience(updated);
  };

  // Bullet Point handlers
  const handleAddBullet = (expIndex: number) => {
    const updated = [...experiences];
    updated[expIndex].bulletPoints = [...(updated[expIndex].bulletPoints || []), ''];
    updateExperience(updated);
  };

  const handleUpdateBullet = (expIndex: number, bulletIndex: number, text: string) => {
    const updated = [...experiences];
    const bullets = [...(updated[expIndex].bulletPoints || [])];
    bullets[bulletIndex] = text;
    updated[expIndex].bulletPoints = bullets;
    updateExperience(updated);
  };

  const handleDeleteBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...experiences];
    const bullets = updated[expIndex].bulletPoints.filter((_, i) => i !== bulletIndex);
    updated[expIndex].bulletPoints = bullets;
    updateExperience(updated);
  };

  const handleAiImproveBullet = async (expIndex: number, bulletIndex: number, text: string) => {
    if (!text.trim()) return;
    setImproving(true);
    try {
      const exp = experiences[expIndex];
      const res = await api.improveBullet({
        originalText: text,
        jobTitle: exp.jobTitle || 'Software Engineer',
      });
      setAiBulletModal({
        expIndex,
        bulletIndex,
        original: text,
        suggestions: res.suggestions || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setImproving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            Work Experience
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Highlight measurable impact, scale, and technologies for each position.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddExperience}
          className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-sm text-slate-500">No work experience added yet.</p>
          <button
            type="button"
            onClick={handleAddExperience}
            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
          >
            + Add your first position
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, expIdx) => {
            return (
              <div
                key={exp.id}
                className="p-4 border border-slate-200 hover:border-slate-300 rounded-xl bg-white shadow-xs space-y-4 transition"
              >
                {/* Header row */}
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-xs font-bold text-slate-700">
                    Position #{expIdx + 1}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(expIdx, 'up')}
                      disabled={expIdx === 0}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(expIdx, 'down')}
                      disabled={expIdx === experiences.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 rounded"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(expIdx)}
                      className="p-1 text-red-500 hover:text-red-700 ml-1 rounded"
                      title="Delete Position"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={exp.jobTitle || ''}
                      onChange={(e) => handleUpdateItem(expIdx, { jobTitle: e.target.value })}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Employer / Company <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={exp.employer || ''}
                        onChange={(e) => handleUpdateItem(expIdx, { employer: e.target.value })}
                        placeholder="e.g. CloudInfosoft"
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      {exp.employer && (
                        <Building2 className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={exp.location || ''}
                      onChange={(e) => handleUpdateItem(expIdx, { location: e.target.value })}
                      placeholder="e.g. San Francisco, CA (or Remote)"
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Employment Type
                    </label>
                    <select
                      value={exp.employmentType || 'Full-time'}
                      onChange={(e) =>
                        handleUpdateItem(expIdx, { employmentType: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={exp.startDate || ''}
                      onChange={(e) => handleUpdateItem(expIdx, { startDate: e.target.value })}
                      placeholder="e.g. Jan 2022"
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      End Date
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        disabled={exp.isCurrent}
                        value={exp.isCurrent ? 'Present' : exp.endDate || ''}
                        onChange={(e) => handleUpdateItem(expIdx, { endDate: e.target.value })}
                        placeholder="e.g. Dec 2023"
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-slate-100"
                      />
                      <label className="flex items-center gap-1.5 text-xs text-slate-600 whitespace-nowrap cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.isCurrent || false}
                          onChange={(e) =>
                            handleUpdateItem(expIdx, { isCurrent: e.target.checked })
                          }
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        Current
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description Rich Text Editor with Formatting Toolbar & AI Pills */}
                <div className="pt-1">
                  <RichTextEditor
                    label="Description & Responsibilities"
                    value={exp.responsibilities || ''}
                    onChange={(val) => handleUpdateItem(expIdx, { responsibilities: val })}
                    jobTitle={exp.jobTitle || 'Software Engineer'}
                    placeholder="Write a clear summary of your position, scope, or key contributions. Use bold for key tech and metrics..."
                    minRows={3}
                  />
                </div>

                {/* Bullet Points */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Key Achievements & Bullet Points
                    </label>
                    <button
                      type="button"
                      onClick={() => handleAddBullet(expIdx)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      + Add Bullet
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(exp.bulletPoints || []).map((bp, bpIdx) => (
                      <div key={bpIdx} className="flex items-start gap-2">
                        <span className="text-slate-400 mt-2 text-xs">•</span>
                        <textarea
                          rows={2}
                          value={bp}
                          onChange={(e) => handleUpdateBullet(expIdx, bpIdx, e.target.value)}
                          placeholder="e.g. Architected **Node.js/React** microservice handling 1M+ daily queries, reducing P99 latency by 35%..."
                          className="flex-1 p-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <div className="flex flex-col gap-1 mt-1">
                          <button
                            type="button"
                            onClick={() => handleAiImproveBullet(expIdx, bpIdx, bp)}
                            disabled={improving || !bp.trim()}
                            title="AI Rewrite & Optimize Bullet"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded text-xs flex items-center justify-center disabled:opacity-30"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBullet(expIdx, bpIdx)}
                            className="p-1.5 text-slate-400 hover:text-red-500 rounded text-xs flex items-center justify-center"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Bullet Improvement Modal */}
      {aiBulletModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Select High-Impact Bullet Alternative
              </h3>
              <button
                onClick={() => setAiBulletModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded">
              Original: "{aiBulletModal.original}"
            </div>
            <div className="space-y-2.5">
              {aiBulletModal.suggestions.map((sug, i) => (
                <div
                  key={i}
                  onClick={() => {
                    handleUpdateBullet(aiBulletModal.expIndex, aiBulletModal.bulletIndex, sug);
                    setAiBulletModal(null);
                  }}
                  className="p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition text-xs leading-relaxed text-slate-800"
                >
                  {sug}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

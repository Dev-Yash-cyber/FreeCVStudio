import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore.js';
import { Sparkles, User, Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase } from 'lucide-react';
import { api } from '../../services/api.js';

export const PersonalInfoForm: React.FC = () => {
  const { resume, updatePersonalInfo } = useResumeStore();
  const info = resume?.data?.personalInfo || ({} as any);

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiModal, setShowAiModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updatePersonalInfo({ [name]: value });
  };

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const skills = (resume?.data?.skillCategories || []).flatMap((c) => c.skills.map((s) => s.name));
      const res = await api.generateSummary({
        jobTitle: info.headline || 'Software Engineer',
        yearsOfExperience: 4,
        keySkills: skills.slice(0, 5),
      });
      setAiSuggestions(res.summaries || []);
      setShowAiModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Personal Details
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Recruiters scan contact details first. Keep information clear and up to date.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              name="fullName"
              value={info.fullName || ''}
              onChange={handleChange}
              placeholder="e.g. Alex Morgan"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Headline */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Professional Headline
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              name="headline"
              value={info.headline || ''}
              onChange={handleChange}
              placeholder="e.g. Senior Full Stack Software Engineer"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              name="email"
              value={info.email || ''}
              onChange={handleChange}
              placeholder="alex@example.com"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="tel"
              name="phone"
              value={info.phone || ''}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* City & Country */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            City, State
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              name="city"
              value={info.city || ''}
              onChange={handleChange}
              placeholder="San Francisco, CA"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={info.country || ''}
            onChange={handleChange}
            placeholder="United States"
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Links */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            LinkedIn Profile
          </label>
          <div className="relative">
            <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="url"
              name="linkedin"
              value={info.linkedin || ''}
              onChange={handleChange}
              placeholder="linkedin.com/in/username"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            GitHub / Portfolio
          </label>
          <div className="relative">
            <Github className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="url"
              name="github"
              value={info.github || ''}
              onChange={handleChange}
              placeholder="github.com/username"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Professional Summary
          </label>
          <button
            type="button"
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md transition hover:bg-blue-100"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGenerating ? 'AI Generating...' : 'AI Assistant Suggestions'}
          </button>
        </div>
        <textarea
          name="summary"
          rows={4}
          value={info.summary || ''}
          onChange={handleChange}
          placeholder="Briefly highlight your years of experience, core technical specialties, leadership background, and notable career achievements..."
          className="w-full p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
        />
      </div>

      {/* AI Suggestions Modal/Drawer */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Select AI Generated Summary
              </h3>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {aiSuggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    updatePersonalInfo({ summary: s });
                    setShowAiModal(false);
                  }}
                  className="p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer transition text-xs leading-relaxed text-slate-700"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

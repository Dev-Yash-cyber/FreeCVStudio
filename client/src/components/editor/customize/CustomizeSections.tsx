import React from 'react';
import { useResumeStore } from '../../../store/useResumeStore.js';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  GripVertical,
  RotateCcw,
} from 'lucide-react';

const DEFAULT_ORDER = [
  'personalInfo',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'awards',
  'publications',
  'volunteering',
  'interests',
  'references',
];

const SECTION_LABELS: Record<string, string> = {
  personalInfo: 'Personal Details & Header',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills & Tech Stack',
  projects: 'Projects',
  certifications: 'Certifications',
  awards: 'Honors & Awards',
  publications: 'Publications',
  volunteering: 'Volunteering',
  interests: 'Interests & Activities',
  references: 'References',
};

export const CustomizeSections: React.FC = () => {
  const { resume, updateSectionOrder, toggleSectionVisibility } = useResumeStore();
  const order =
    resume?.data?.sectionOrder && resume.data.sectionOrder.length > 0
      ? resume.data.sectionOrder
      : DEFAULT_ORDER;
  const hidden = new Set(resume?.data?.hiddenSections || []);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...order];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    updateSectionOrder(newOrder);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#7c3aed]" />
          Section Order & Visibility
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Reorder sections or hide sections you do not want displayed on your resume.
        </p>
      </div>

      {/* Sections List */}
      <div className="space-y-2">
        {order.map((secId, idx) => {
          const isHidden = hidden.has(secId);
          const label = SECTION_LABELS[secId] || secId;
          const isFirst = idx === 0;
          const isLast = idx === order.length - 1;

          return (
            <div
              key={secId}
              className={`p-3 rounded-xl border transition flex items-center justify-between ${
                isHidden
                  ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                  : 'bg-white border-slate-200/90 text-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <GripVertical className="w-4 h-4 text-slate-300 flex-shrink-0" />
                <span className={`text-xs font-semibold truncate ${isHidden ? 'line-through text-slate-400' : ''}`}>
                  {label}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Move Up */}
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={() => moveSection(idx, 'up')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={isLast}
                  onClick={() => moveSection(idx, 'down')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <div className="h-3 w-px bg-slate-200 mx-1" />

                {/* Toggle Visibility */}
                <button
                  type="button"
                  onClick={() => toggleSectionVisibility(secId)}
                  className={`p-1 rounded transition ${
                    isHidden
                      ? 'text-slate-400 hover:text-slate-700'
                      : 'text-[#7c3aed] hover:text-[#6d28d9]'
                  }`}
                  title={isHidden ? 'Show Section' : 'Hide Section'}
                >
                  {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset */}
      <div className="pt-4 border-t border-slate-200 flex justify-end">
        <button
          type="button"
          onClick={() => updateSectionOrder(DEFAULT_ORDER)}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Standard Section order
        </button>
      </div>
    </div>
  );
};

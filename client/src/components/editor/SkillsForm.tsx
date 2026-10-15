import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore.js';
import { SkillCategory, SkillItem } from '../../types/index.js';
import { Award, Plus, Trash2, X } from 'lucide-react';

const SUGGESTED_SKILLS = [
  'TypeScript', 'React', 'Node.js', 'Next.js', 'Python', 'Docker',
  'Kubernetes', 'AWS', 'PostgreSQL', 'MongoDB', 'GraphQL', 'Tailwind CSS',
  'CI/CD', 'Git', 'System Design', 'Agile / Scrum', 'Redis', 'Unit Testing'
];

export const SkillsForm: React.FC = () => {
  const { resume, updateSkills } = useResumeStore();
  const categories = resume?.data?.skillCategories || [];
  const [newSkillInput, setNewSkillInput] = useState<{ [catId: string]: string }>({});

  const handleAddCategory = () => {
    const newCat: SkillCategory = {
      id: `cat-${Date.now()}`,
      categoryName: 'Technical Skills',
      skills: [],
    };
    updateSkills([...categories, newCat]);
  };

  const handleDeleteCategory = (catIndex: number) => {
    updateSkills(categories.filter((_, i) => i !== catIndex));
  };

  const handleUpdateCategoryName = (catIndex: number, name: string) => {
    const updated = [...categories];
    updated[catIndex].categoryName = name;
    updateSkills(updated);
  };

  const handleAddSkill = (catIndex: number, skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;

    const updated = [...categories];
    const existing = updated[catIndex].skills || [];
    if (!existing.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      updated[catIndex].skills = [...existing, { name: trimmed, level: 'Advanced' }];
      updateSkills(updated);
    }
    setNewSkillInput({ ...newSkillInput, [updated[catIndex].id]: '' });
  };

  const handleDeleteSkill = (catIndex: number, skillIndex: number) => {
    const updated = [...categories];
    updated[catIndex].skills = updated[catIndex].skills.filter((_, i) => i !== skillIndex);
    updateSkills(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Skills & Competencies
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize skills into categories for optimal ATS keyword matching.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddCategory}
          className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Skill Category
        </button>
      </div>

      {/* Suggested Quick Add Chips */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
          Popular Industry Keywords (Click to add)
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_SKILLS.map((skill, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (categories.length === 0) handleAddCategory();
                handleAddSkill(0, skill);
              }}
              className="text-xs font-medium bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 px-2 py-1 rounded-md transition"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-sm text-slate-500">No skill categories added.</p>
          <button
            type="button"
            onClick={handleAddCategory}
            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
          >
            + Create a skill category
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((cat, catIdx) => (
            <div
              key={cat.id}
              className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={cat.categoryName || ''}
                  onChange={(e) => handleUpdateCategoryName(catIdx, e.target.value)}
                  placeholder="e.g. Programming Languages, Frameworks, Cloud..."
                  className="font-bold text-sm text-slate-900 border-b border-dashed border-slate-300 hover:border-slate-500 focus:border-blue-500 focus:outline-none pb-0.5"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(catIdx)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Skill Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(cat.skills || []).map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-800 text-xs px-2.5 py-1 rounded-full border border-blue-200 font-medium"
                  >
                    <span>{skill.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(catIdx, sIdx)}
                      className="text-blue-500 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add Input */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newSkillInput[cat.id] || ''}
                  onChange={(e) => setNewSkillInput({ ...newSkillInput, [cat.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(catIdx, newSkillInput[cat.id] || '');
                    }
                  }}
                  placeholder="Type skill and press Enter (e.g. Docker, React...)"
                  className="flex-1 px-3 py-1.5 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(catIdx, newSkillInput[cat.id] || '')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { useResumeStore } from '../../store/useResumeStore.js';
import { EducationItem } from '../../types/index.js';
import { GraduationCap, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

export const EducationForm: React.FC = () => {
  const { resume, updateEducation } = useResumeStore();
  const educations = resume?.data?.education || [];

  const handleAdd = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      gpa: '',
      coursework: [],
      achievements: [],
    };
    updateEducation([...educations, newItem]);
  };

  const handleUpdate = (index: number, updates: Partial<EducationItem>) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], ...updates };
    updateEducation(updated);
  };

  const handleDelete = (index: number) => {
    updateEducation(educations.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === educations.length - 1)
    )
      return;
    const target = direction === 'up' ? index - 1 : index + 1;
    const updated = [...educations];
    const [moved] = updated.splice(index, 1);
    updated.splice(target, 0, moved);
    updateEducation(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Education
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Include degrees, institutions, graduation dates, and academic honors.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>

      {educations.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
          <p className="text-sm text-slate-500">No education entries added yet.</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
          >
            + Add your degree
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu, idx) => (
            <div
              key={edu.id}
              className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-xs font-bold text-slate-400">Education #{idx + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === educations.length - 1}
                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="p-1 text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution / University <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => handleUpdate(idx, { institution: e.target.value })}
                    placeholder="e.g. Stanford University"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => handleUpdate(idx, { degree: e.target.value })}
                    placeholder="e.g. Bachelor of Science"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Field of Study / Major
                  </label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy || ''}
                    onChange={(e) => handleUpdate(idx, { fieldOfStudy: e.target.value })}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GPA / Honors</label>
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => handleUpdate(idx, { gpa: e.target.value })}
                    placeholder="e.g. 3.9 / 4.0 or Magna Cum Laude"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate || ''}
                    onChange={(e) => handleUpdate(idx, { startDate: e.target.value })}
                    placeholder="e.g. 2018"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="text"
                    value={edu.endDate || ''}
                    onChange={(e) => handleUpdate(idx, { endDate: e.target.value })}
                    placeholder="e.g. 2022"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

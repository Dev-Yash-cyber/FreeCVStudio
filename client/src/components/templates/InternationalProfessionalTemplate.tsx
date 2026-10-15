import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';

export const InternationalProfessionalTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#b45309';

  return (
    <div className="w-full">
      {/* Global Header */}
      <div className="border-b-2 pb-3 mb-4 border-amber-600 flex justify-between items-start">
        <div>
          <h1 className="font-extrabold tracking-tight text-slate-900" style={{ fontSize: `${design.nameFontSize || 26}px` }}>
            {p.fullName || 'International Consultant'}
          </h1>
          {p.headline && (
            <p className="font-semibold text-xs mt-0.5 text-amber-700">
              {p.headline}
            </p>
          )}
        </div>
        <div className="text-right text-xs text-slate-600">
          {(p.city || p.country) && <div className="font-semibold text-slate-800">📍 {[p.city, p.country].filter(Boolean).join(', ')}</div>}
          {p.email && <div>{p.email}</div>}
          {p.phone && <div>{p.phone}</div>}
          {p.linkedin && <div>{p.linkedin}</div>}
        </div>
      </div>

      {/* Summary */}
      {!hidden.has('summary') && p.summary && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b pb-0.5 mb-1">
            Global Career Profile
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{p.summary}</p>
        </div>
      )}

      {/* Experience */}
      {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b pb-0.5 mb-2">
            Cross-Border & Enterprise Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.jobTitle} — <span className="text-amber-800">{exp.employer}</span></span>
                  <span className="font-normal text-slate-500">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                {exp.location && <div className="text-slate-500 text-[11px] mb-0.5">Location: {exp.location}</div>}
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc ml-5 space-y-0.5 text-slate-700 mt-1">
                    {exp.bulletPoints.map((bp, i) => (
                      <li key={i}>{bp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education & Languages */}
      <div className="grid grid-cols-2 gap-4">
        {!hidden.has('education') && data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b pb-0.5 mb-1.5">
              Education & Degrees
            </h2>
            <div className="space-y-1.5 text-xs">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institution}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900 border-b pb-0.5 mb-1.5">
              Languages & International Competencies
            </h2>
            <div className="space-y-1 text-xs">
              {data.skillCategories.map((cat) => (
                <div key={cat.id}>
                  <span className="font-bold text-slate-800">{cat.categoryName}: </span>
                  <span className="text-slate-600">{cat.skills.map((s) => s.name).join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

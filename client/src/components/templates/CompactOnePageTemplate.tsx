import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';

export const CompactOnePageTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#0f172a';

  return (
    <div className="w-full text-[10px] leading-tight">
      {/* Super Compact Header */}
      <div className="flex justify-between items-baseline border-b pb-1.5 mb-2 border-slate-300">
        <div>
          <span className="font-extrabold text-base text-slate-900 mr-2">{p.fullName || 'Candidate'}</span>
          <span className="font-semibold text-slate-600">{p.headline}</span>
        </div>
        <div className="text-right text-slate-500 space-x-2">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {(p.city || p.country) && <span>• {[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.linkedin && <span>• {p.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {!hidden.has('summary') && p.summary && (
        <div className="mb-2">
          <p className="text-slate-700 leading-snug">{p.summary}</p>
        </div>
      )}

      {/* Compact 2-column body */}
      <div className="grid grid-cols-12 gap-3">
        {/* Main Column (Experience) */}
        <div className="col-span-8 space-y-2">
          {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
            <div>
              <div className="font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1.5">
                Work Experience
              </div>
              <div className="space-y-2">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{exp.jobTitle} — <span className="font-normal text-slate-600">{exp.employer}</span></span>
                      <span className="text-slate-500 font-normal">{exp.startDate} - {exp.isCurrent ? 'Pres' : exp.endDate}</span>
                    </div>
                    {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                      <ul className="list-disc ml-3.5 space-y-0.5 text-slate-700 mt-0.5">
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

          {!hidden.has('projects') && data.projects && data.projects.length > 0 && (
            <div>
              <div className="font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1">
                Projects
              </div>
              <div className="space-y-1">
                {data.projects.map((proj) => (
                  <div key={proj.id}>
                    <span className="font-bold text-slate-900">{proj.name}: </span>
                    <span className="text-slate-700">{proj.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Side Column (Skills & Education) */}
        <div className="col-span-4 space-y-2 border-l pl-2 border-slate-200">
          {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
            <div>
              <div className="font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1">
                Skills
              </div>
              <div className="space-y-1">
                {data.skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <span className="font-semibold text-slate-800">{cat.categoryName}: </span>
                    <span className="text-slate-600">{cat.skills.map((s) => s.name).join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hidden.has('education') && data.education && data.education.length > 0 && (
            <div>
              <div className="font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1">
                Education
              </div>
              <div className="space-y-1">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-slate-600">{edu.institution}</div>
                    <div className="text-slate-400">{edu.startDate} - {edu.isCurrent ? 'Pres' : edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!hidden.has('certifications') && data.certifications && data.certifications.length > 0 && (
            <div>
              <div className="font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5 mb-1">
                Certifications
              </div>
              <div className="space-y-0.5 text-slate-700">
                {data.certifications.map((c) => (
                  <div key={c.id}>• {c.name}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

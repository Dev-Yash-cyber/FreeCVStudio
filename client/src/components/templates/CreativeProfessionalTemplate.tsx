import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';

export const CreativeProfessionalTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#7c3aed';

  return (
    <div className="w-full flex gap-5">
      {/* Left Colored Sidebar */}
      <div className="w-1/3 bg-purple-50/70 p-4 rounded-lg space-y-5 border border-purple-100/50">
        <div>
          <h1 className="font-extrabold tracking-tight text-slate-900 leading-tight" style={{ fontSize: `${(design.nameFontSize || 26) - 4}px` }}>
            {p.fullName || 'Creative Name'}
          </h1>
          {p.headline && (
            <p className="font-semibold text-xs mt-1" style={{ color: accent }}>
              {p.headline}
            </p>
          )}
        </div>

        {/* Contact info */}
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-1">Contact</div>
          {p.email && <div className="break-all">{p.email}</div>}
          {p.phone && <div>{p.phone}</div>}
          {(p.city || p.country) && <div>{[p.city, p.country].filter(Boolean).join(', ')}</div>}
          {p.website && <div className="text-purple-700 font-medium break-all">{p.website}</div>}
          {p.linkedin && <div className="break-all">{p.linkedin}</div>}
        </div>

        {/* Skills */}
        {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
          <div className="space-y-2">
            <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Expertise</div>
            {data.skillCategories.map((cat) => (
              <div key={cat.id}>
                <span className="font-semibold text-[11px] text-slate-800 block mb-0.5">{cat.categoryName}</span>
                <div className="flex flex-wrap gap-1">
                  {cat.skills.map((s, idx) => (
                    <span key={idx} className="bg-white border border-purple-200 text-purple-900 text-[10px] px-1.5 py-0.5 rounded">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {!hidden.has('education') && data.education && data.education.length > 0 && (
          <div className="space-y-2 text-xs">
            <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Education</div>
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="font-bold text-slate-800">{edu.degree}</div>
                <div className="text-slate-600">{edu.institution}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Content Area */}
      <div className="w-2/3 space-y-4">
        {/* Profile */}
        {!hidden.has('summary') && p.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 border-b border-purple-200 pb-1 mb-2">
              Creative Vision & Profile
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">{p.summary}</p>
          </div>
        )}

        {/* Experience */}
        {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 border-b border-purple-200 pb-1 mb-3">
              Design & Industry Experience
            </h2>
            <div className="space-y-3.5">
              {data.experience.map((exp) => (
                <div key={exp.id} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{exp.jobTitle}</span>
                    <span className="font-normal text-slate-400">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="font-semibold text-purple-700 mb-1">{exp.employer}</div>
                  {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                    <ul className="list-disc ml-4 space-y-0.5 text-slate-600">
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

        {/* Projects / Portfolio Highlights */}
        {!hidden.has('projects') && data.projects && data.projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 border-b border-purple-200 pb-1 mb-2">
              Featured Work
            </h2>
            <div className="space-y-2 text-xs">
              {data.projects.map((proj) => (
                <div key={proj.id} className="border-l-2 border-purple-400 pl-2">
                  <span className="font-bold text-slate-900">{proj.name}</span>
                  <p className="text-slate-600 mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

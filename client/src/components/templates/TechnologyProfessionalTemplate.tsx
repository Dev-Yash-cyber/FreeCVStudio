import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';

export const TechnologyProfessionalTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#0891b2';
  const heading = design.headingColor || '#0f172a';

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 pb-4 mb-4" style={{ borderColor: accent }}>
        <div>
          <h1 className="font-extrabold tracking-tight text-slate-900" style={{ fontSize: `${design.nameFontSize || 26}px` }}>
            {p.fullName || 'Tech Lead'}
          </h1>
          {p.headline && (
            <p className="font-semibold text-xs mt-1 uppercase tracking-wider" style={{ color: accent }}>
              {p.headline}
            </p>
          )}
        </div>
        <div className="text-right text-xs text-slate-600 space-y-0.5">
          {p.email && <div>{p.email}</div>}
          {p.phone && <div>{p.phone}</div>}
          {(p.city || p.country) && <div>{[p.city, p.country].filter(Boolean).join(', ')}</div>}
          {p.linkedin && <div>{p.linkedin}</div>}
        </div>
      </div>

      {/* Summary */}
      {!hidden.has('summary') && p.summary && (
        <div className="mb-4 bg-cyan-50/50 p-3 rounded border border-cyan-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-900 mb-1">
            System & Architecture Expertise
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">{p.summary}</p>
        </div>
      )}

      {/* Technical Experience */}
      {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-900 border-b pb-1">
            Engineering & Infrastructure Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                  <span>{exp.jobTitle} — <span style={{ color: accent }}>{exp.employer}</span></span>
                  <span className="font-mono text-slate-500 font-normal">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc ml-4 mt-1 space-y-1 text-xs text-slate-700">
                    {exp.bulletPoints.map((bp, i) => (
                      <li key={i}>{bp}</li>
                    ))}
                  </ul>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="text-[11px] font-mono text-cyan-700 mt-1 pl-4">
                    ENV: {exp.technologies.join(' | ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Matrix */}
      {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-900 border-b pb-1">
            Core Technical Proficiencies
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {data.skillCategories.map((cat) => (
              <div key={cat.id} className="border border-slate-200 p-2 rounded">
                <span className="font-bold text-slate-800 block mb-0.5">{cat.categoryName}</span>
                <span className="text-slate-600 font-mono text-[11px]">{cat.skills.map((s) => s.name).join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Education */}
      <div className="grid grid-cols-2 gap-4">
        {!hidden.has('education') && data.education && data.education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-900 border-b pb-0.5">
              Education
            </h2>
            <div className="space-y-1 text-xs">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-slate-800">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institution}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!hidden.has('certifications') && data.certifications && data.certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-900 border-b pb-0.5">
              Certifications
            </h2>
            <div className="space-y-1 text-xs">
              {data.certifications.map((cert) => (
                <div key={cert.id}>
                  <div className="font-bold text-slate-800">{cert.name}</div>
                  <div className="text-slate-500">{cert.issuer}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

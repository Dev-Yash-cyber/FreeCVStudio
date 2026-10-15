import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';

export const GraduateTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#4338ca';

  return (
    <div className="w-full">
      {/* Header */}
      <header className="border-b pb-3 mb-4 border-slate-300">
        <h1
          className="font-bold text-center tracking-tight text-slate-900"
          style={{ fontSize: `${design.nameFontSize || 26}px` }}
        >
          {p.fullName || 'Candidate Name'}
        </h1>
        {p.headline && (
          <p className="text-center font-medium text-xs mt-0.5" style={{ color: accent }}>
            {p.headline}
          </p>
        )}
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>| {p.phone}</span>}
          {(p.city || p.country) && <span>| {[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.linkedin && <span>| {p.linkedin}</span>}
        </div>
      </header>

      {/* Profile */}
      {!hidden.has('summary') && p.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-0.5 mb-1.5" style={{ borderColor: accent }}>
            Academic & Professional Background
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{p.summary}</p>
        </section>
      )}

      {/* Education */}
      {!hidden.has('education') && data.education && data.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-0.5 mb-1.5" style={{ borderColor: accent }}>
            Education
          </h2>
          <div className="space-y-2 text-xs">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{edu.degree} in {edu.fieldOfStudy}, {edu.institution}</span>
                  <span className="font-normal text-slate-500">{edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate}</span>
                </div>
                {edu.gpa && <div className="text-slate-600">Graduated with GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-0.5 mb-1.5" style={{ borderColor: accent }}>
            Experience & Research Positions
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{exp.jobTitle} — {exp.employer}</span>
                  <span className="font-normal text-slate-500">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc ml-5 mt-1 space-y-0.5 text-slate-700">
                    {exp.bulletPoints.map((bp, i) => (
                      <li key={i}>{bp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications / Projects */}
      {!hidden.has('publications') && data.publications && data.publications.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-0.5 mb-1.5" style={{ borderColor: accent }}>
            Selected Publications & Papers
          </h2>
          <div className="space-y-1.5 text-xs text-slate-700">
            {data.publications.map((pub) => (
              <div key={pub.id}>
                <span className="font-semibold text-slate-900">"{pub.title}"</span> — {pub.publisher} ({pub.date})
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b pb-0.5 mb-1.5" style={{ borderColor: accent }}>
            Specialized Skills & Methodologies
          </h2>
          <div className="space-y-1 text-xs text-slate-700">
            {data.skillCategories.map((cat) => (
              <div key={cat.id}>
                <span className="font-semibold text-slate-900">{cat.categoryName}: </span>
                <span>{cat.skills.map((s) => s.name).join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';

export const ExecutiveTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#1c1917';
  const heading = design.headingColor || '#0c0a09';

  return (
    <div className="w-full font-serif">
      {/* Centered Board-level Header */}
      <header className="text-center border-b pb-4 mb-5 border-stone-300">
        <h1
          className="font-bold tracking-normal uppercase"
          style={{ fontSize: `${design.nameFontSize || 26}px`, color: heading }}
        >
          {p.fullName || 'Your Name'}
        </h1>
        {p.headline && (
          <p className="font-medium italic tracking-wide text-xs mt-1 text-stone-600">
            {p.headline}
          </p>
        )}
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-stone-500 font-sans">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {(p.city || p.country) && <span>• {[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.linkedin && <span>• {p.linkedin}</span>}
        </div>
      </header>

      {/* Executive Summary */}
      {!hidden.has('summary') && p.summary && (
        <section className="mb-5">
          <h2 className="text-center text-xs font-bold uppercase tracking-widest text-stone-800 mb-2 font-sans border-b border-stone-200 pb-1">
            Executive Leadership Profile
          </h2>
          <p className="text-stone-700 leading-relaxed text-center italic text-xs px-4">
            "{p.summary}"
          </p>
        </section>
      )}

      {/* Career History */}
      {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-3 font-sans border-b border-stone-200 pb-1">
            Professional Experience & Board Leadership
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-bold text-stone-900 text-xs">{exp.jobTitle}</span>
                  <span className="text-xs text-stone-500 font-sans">
                    {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs italic text-stone-600 mb-1">
                  {exp.employer} {exp.location ? `, ${exp.location}` : ''}
                </div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc ml-5 space-y-1 text-xs text-stone-700 font-sans">
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

      {/* Education & Academic Honors */}
      {!hidden.has('education') && data.education && data.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-2 font-sans border-b border-stone-200 pb-1">
            Education & Academic Credentials
          </h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-stone-900">{edu.degree}</span>
                  <span className="text-stone-700">, {edu.fieldOfStudy}</span>
                  <span className="text-stone-600 italic"> — {edu.institution}</span>
                </div>
                <span className="text-stone-500 font-sans">{edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Competencies */}
      {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-2 font-sans border-b border-stone-200 pb-1">
            Areas of Strategic Expertise
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-sans">
            {data.skillCategories.map((cat) => (
              <div key={cat.id}>
                <span className="font-bold text-stone-800">{cat.categoryName}: </span>
                <span className="text-stone-600">{cat.skills.map((s) => s.name).join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

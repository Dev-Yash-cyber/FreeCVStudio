import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';

export const ElegantContemporaryTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#44403c';

  return (
    <div className="w-full">
      {/* Editorial Header */}
      <header className="mb-6 border-b pb-4 border-stone-200">
        <h1
          className="font-serif tracking-tight text-stone-900"
          style={{ fontSize: `${design.nameFontSize || 28}px` }}
        >
          {p.fullName || 'Candidate Name'}
        </h1>
        {p.headline && (
          <p className="text-stone-500 font-sans tracking-widest uppercase text-[11px] mt-1">
            {p.headline}
          </p>
        )}
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-stone-400 font-sans">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {(p.city || p.country) && <span>{[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.website && <span>{p.website}</span>}
        </div>
      </header>

      {/* Editorial Summary */}
      {!hidden.has('summary') && p.summary && (
        <section className="mb-6">
          <p className="font-serif text-stone-700 leading-relaxed italic text-xs">
            "{p.summary}"
          </p>
        </section>
      )}

      {/* Experience */}
      {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-3 border-b border-stone-100 pb-1">
            Selected Experience
          </h2>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="font-serif font-bold text-stone-900 text-xs">{exp.jobTitle}</span>
                  <span className="text-[11px] text-stone-400 font-sans">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-[11px] text-stone-600 mb-1 font-sans">{exp.employer}</div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="space-y-1 text-stone-600 text-xs pl-3">
                    {exp.bulletPoints.map((bp, i) => (
                      <li key={i} className="list-disc">{bp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Skills Grid */}
      <div className="grid grid-cols-2 gap-6">
        {!hidden.has('education') && data.education && data.education.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-2 border-b border-stone-100 pb-1">
              Academic Background
            </h2>
            <div className="space-y-2 text-xs">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-serif font-bold text-stone-900">{edu.degree}</div>
                  <div className="text-stone-600">{edu.institution}</div>
                  <div className="text-[10px] text-stone-400">{edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-400 mb-2 border-b border-stone-100 pb-1">
              Core Competencies
            </h2>
            <div className="space-y-2 text-xs">
              {data.skillCategories.map((cat) => (
                <div key={cat.id}>
                  <div className="font-bold text-stone-800 text-[11px]">{cat.categoryName}</div>
                  <div className="text-stone-600 text-[11px]">{cat.skills.map((s) => s.name).join(', ')}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

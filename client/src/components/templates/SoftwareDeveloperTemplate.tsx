import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';

export const SoftwareDeveloperTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#2563eb';
  const heading = design.headingColor || '#0f172a';

  return (
    <div className="w-full">
      {/* Top Header */}
      <header className="border-b pb-3 mb-4 border-slate-200">
        <div className="flex justify-between items-baseline flex-wrap gap-2">
          <div>
            <h1
              className="font-extrabold tracking-tight font-mono text-slate-900"
              style={{ fontSize: `${design.nameFontSize || 26}px` }}
            >
              {p.fullName || 'Dev Candidate'}
            </h1>
            {p.headline && (
              <p className="font-semibold text-xs mt-0.5" style={{ color: accent }}>
                &gt; {p.headline}
              </p>
            )}
          </div>
          <div className="text-right text-xs font-mono text-slate-500 space-y-0.5">
            {p.email && <div>{p.email}</div>}
            {p.github && <div className="text-blue-600">{p.github}</div>}
            {p.linkedin && <div>{p.linkedin}</div>}
            {(p.city || p.country) && <div>{[p.city, p.country].filter(Boolean).join(', ')}</div>}
          </div>
        </div>
      </header>

      {/* Two Column Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Main Column (Experience & Projects) */}
        <div className="col-span-8">
          {/* Summary */}
          {!hidden.has('summary') && p.summary && (
            <div className="mb-4">
              <p className="text-xs text-slate-700 leading-relaxed">{p.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold uppercase text-slate-900 border-b-2 pb-0.5" style={{ borderColor: accent }}>
                  // Professional Experience
                </span>
              </div>
              <div className="space-y-4">
                {data.experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-xs text-slate-900">{exp.jobTitle}</span>
                      <span className="font-mono text-xs text-slate-400">
                        {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-xs font-semibold mb-1" style={{ color: accent }}>
                      @{exp.employer} {exp.location ? `(${exp.location})` : ''}
                    </div>
                    {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                      <ul className="list-disc ml-4 space-y-1 text-xs text-slate-700">
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

          {/* Projects */}
          {!hidden.has('projects') && data.projects && data.projects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold uppercase text-slate-900 border-b-2 pb-0.5" style={{ borderColor: accent }}>
                  // Technical Projects
                </span>
              </div>
              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{proj.name} {proj.role ? <span className="font-normal text-slate-500">({proj.role})</span> : ''}</span>
                      {proj.startDate && <span className="font-mono text-slate-400 font-normal">{proj.startDate}</span>}
                    </div>
                    <p className="text-slate-600 mt-0.5">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-700 font-mono text-[10px] px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column (Skills, Education, Certifications) */}
        <div className="col-span-4 border-l pl-4 border-slate-200 space-y-5">
          {/* Tech Stack / Skills */}
          {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
            <div>
              <div className="font-mono text-xs font-bold uppercase text-slate-900 mb-2 border-b pb-0.5">
                # Tech Stack
              </div>
              <div className="space-y-3">
                {data.skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <div className="font-semibold text-xs text-slate-700 mb-1">{cat.categoryName}</div>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 font-mono text-[10px] px-1.5 py-0.5 rounded font-medium">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {!hidden.has('education') && data.education && data.education.length > 0 && (
            <div>
              <div className="font-mono text-xs font-bold uppercase text-slate-900 mb-2 border-b pb-0.5">
                # Education
              </div>
              <div className="space-y-2 text-xs">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-slate-800">{edu.degree}</div>
                    <div className="text-slate-600">{edu.fieldOfStudy}</div>
                    <div className="text-slate-400">{edu.institution}</div>
                    <div className="font-mono text-slate-400 text-[10px]">{edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {!hidden.has('certifications') && data.certifications && data.certifications.length > 0 && (
            <div>
              <div className="font-mono text-xs font-bold uppercase text-slate-900 mb-2 border-b pb-0.5">
                # Certifications
              </div>
              <div className="space-y-1.5 text-xs">
                {data.certifications.map((c) => (
                  <div key={c.id}>
                    <div className="font-semibold text-slate-800">{c.name}</div>
                    <div className="text-slate-500 text-[10px]">{c.issuer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

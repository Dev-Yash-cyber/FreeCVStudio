import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';

export const StudentFresherTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#4f46e5';
  const heading = design.headingColor || '#1e1b4b';

  return (
    <div className="w-full">
      {/* Header */}
      <header className="text-center pb-4 mb-4 border-b border-indigo-100">
        <h1
          className="font-extrabold tracking-tight"
          style={{ fontSize: `${design.nameFontSize || 26}px`, color: heading }}
        >
          {p.fullName || 'Student Name'}
        </h1>
        {p.headline && (
          <p className="font-semibold text-xs mt-1" style={{ color: accent }}>
            {p.headline}
          </p>
        )}
        <div className="flex justify-center flex-wrap gap-3 mt-2 text-xs text-slate-500">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {(p.city || p.country) && <span>• {[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.linkedin && <span>• {p.linkedin}</span>}
          {p.github && <span>• {p.github}</span>}
        </div>
      </header>

      {/* Career Objective / Summary */}
      {!hidden.has('summary') && p.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-1.5">
            Career Objective
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{p.summary}</p>
        </section>
      )}

      {/* Education First for Freshers */}
      {!hidden.has('education') && data.education && data.education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2">
            Education & Academic Background
          </h2>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{edu.institution}</span>
                    <span className="text-indigo-700 font-semibold"> — {edu.degree} in {edu.fieldOfStudy}</span>
                  </div>
                  <span className="text-slate-500 font-medium">{edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate}</span>
                </div>
                {edu.gpa && <div className="text-xs text-slate-600 mt-0.5">Cumulative GPA: <span className="font-semibold text-indigo-700">{edu.gpa}</span></div>}
                {edu.coursework && edu.coursework.length > 0 && (
                  <div className="text-xs text-slate-600 mt-1">
                    <span className="font-medium">Relevant Coursework: </span>
                    {edu.coursework.join(', ')}
                  </div>
                )}
                {edu.achievements && edu.achievements.length > 0 && (
                  <ul className="list-disc ml-5 mt-1 text-xs text-slate-600 space-y-0.5">
                    {edu.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {!hidden.has('projects') && data.projects && data.projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2">
            Academic & Independent Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{proj.name}</span>
                  {proj.startDate && <span className="font-normal text-slate-400">{proj.startDate}</span>}
                </div>
                <p className="text-slate-600 mt-0.5">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[11px] text-indigo-600 font-medium mt-0.5">
                    Tools: {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience / Internships */}
      {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-2">
            Internships & Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-900">{exp.jobTitle} — {exp.employer}</span>
                  <span className="text-slate-500">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc ml-5 mt-1 space-y-0.5 text-xs text-slate-600">
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

      {/* Skills */}
      {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-indigo-100 pb-1 mb-1.5">
            Technical & Soft Skills
          </h2>
          <div className="space-y-1 text-xs">
            {data.skillCategories.map((cat) => (
              <div key={cat.id}>
                <span className="font-bold text-slate-800">{cat.categoryName}: </span>
                <span className="text-slate-600">{cat.skills.map((s) => s.name).join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

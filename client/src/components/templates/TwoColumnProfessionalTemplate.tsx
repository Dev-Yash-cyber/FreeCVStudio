import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';

export const TwoColumnProfessionalTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#0d9488';
  const heading = design.headingColor || '#0f172a';

  return (
    <div className="w-full">
      {/* Top Name Bar */}
      <div className="border-b pb-4 mb-5 border-slate-200">
        <h1
          className="font-bold tracking-tight text-slate-900"
          style={{ fontSize: `${design.nameFontSize || 26}px` }}
        >
          {p.fullName || 'Your Name'}
        </h1>
        {p.headline && (
          <p className="font-semibold text-xs mt-0.5" style={{ color: accent }}>
            {p.headline}
          </p>
        )}
      </div>

      <div className="grid grid-cols-12 gap-5">
        {/* Main Content (65%) */}
        <div className="col-span-8 space-y-4">
          {!hidden.has('summary') && p.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-1.5">
                Executive Profile
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed">{p.summary}</p>
            </div>
          )}

          {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-2.5">
                Experience
              </h2>
              <div className="space-y-3.5">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{exp.jobTitle}</span>
                      <span className="font-normal text-slate-400">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="font-semibold text-teal-700 mb-1">{exp.employer}</div>
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

          {!hidden.has('projects') && data.projects && data.projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1 mb-2">
                Projects
              </h2>
              <div className="space-y-2 text-xs">
                {data.projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="font-bold text-slate-900">{proj.name}</div>
                    <p className="text-slate-600">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (35%) */}
        <div className="col-span-4 border-l pl-4 border-slate-200 space-y-4 text-xs">
          {/* Contact Details */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-slate-900 mb-2 border-b pb-0.5">
              Contact
            </h3>
            <div className="space-y-1 text-slate-600">
              {p.email && <div>{p.email}</div>}
              {p.phone && <div>{p.phone}</div>}
              {(p.city || p.country) && <div>{[p.city, p.country].filter(Boolean).join(', ')}</div>}
              {p.linkedin && <div>{p.linkedin}</div>}
            </div>
          </div>

          {/* Skills */}
          {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider text-slate-900 mb-2 border-b pb-0.5">
                Skills
              </h3>
              <div className="space-y-2">
                {data.skillCategories.map((cat) => (
                  <div key={cat.id}>
                    <span className="font-semibold text-slate-800 block mb-0.5">{cat.categoryName}</span>
                    <div className="text-slate-600 space-y-0.5">
                      {cat.skills.map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[11px]">
                          <span>{s.name}</span>
                          <span className="text-[9px] text-teal-600 font-medium">{s.level || 'Advanced'}</span>
                        </div>
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
              <h3 className="font-bold uppercase tracking-wider text-slate-900 mb-2 border-b pb-0.5">
                Education
              </h3>
              <div className="space-y-2">
                {data.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-slate-800">{edu.degree}</div>
                    <div className="text-slate-600">{edu.institution}</div>
                    <div className="text-slate-400 text-[10px]">{edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}</div>
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

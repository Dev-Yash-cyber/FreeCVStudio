import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';

export const TraditionalBusinessTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);

  return (
    <div className="w-full text-slate-900 font-serif">
      {/* Centered Formal Header */}
      <div className="text-center pb-3 mb-3 border-b-2 border-slate-900">
        <h1 className="font-bold uppercase tracking-widest text-xl">
          {p.fullName || 'Candidate Full Name'}
        </h1>
        {p.headline && <div className="text-xs uppercase tracking-wider font-sans font-medium text-slate-700 mt-0.5">{p.headline}</div>}
        <div className="text-xs text-slate-600 font-sans mt-1 space-x-2">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {(p.city || p.country) && <span>• {[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.linkedin && <span>• {p.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {!hidden.has('summary') && p.summary && (
        <div className="mb-3">
          <div className="font-bold text-xs uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-1">
            Summary of Qualifications
          </div>
          <p className="text-xs leading-relaxed text-justify">{p.summary}</p>
        </div>
      )}

      {/* Experience */}
      {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
        <div className="mb-3">
          <div className="font-bold text-xs uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-1.5">
            Professional Experience
          </div>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between font-bold">
                  <span>{exp.employer}</span>
                  <span className="font-normal font-sans text-slate-600">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                <div className="italic text-slate-700">{exp.jobTitle}{exp.location ? `, ${exp.location}` : ''}</div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc ml-5 mt-1 space-y-0.5 text-slate-800">
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

      {/* Education */}
      {!hidden.has('education') && data.education && data.education.length > 0 && (
        <div className="mb-3">
          <div className="font-bold text-xs uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-1.5">
            Education
          </div>
          <div className="space-y-1.5 text-xs">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between">
                <div>
                  <span className="font-bold">{edu.institution}</span>, {edu.degree} in {edu.fieldOfStudy}
                </div>
                <span className="font-sans text-slate-600">{edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
        <div>
          <div className="font-bold text-xs uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-1">
            Skills & Credentials
          </div>
          <div className="text-xs space-y-0.5">
            {data.skillCategories.map((cat) => (
              <div key={cat.id}>
                <span className="font-bold">{cat.categoryName}: </span>
                <span>{cat.skills.map((s) => s.name).join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

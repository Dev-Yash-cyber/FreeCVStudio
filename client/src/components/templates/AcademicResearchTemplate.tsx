import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';

export const AcademicResearchTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#15803d';

  return (
    <div className="w-full font-serif">
      {/* Centered Academic Header */}
      <div className="text-center pb-4 mb-4 border-b-2 border-stone-300">
        <h1
          className="font-bold tracking-normal uppercase text-stone-900"
          style={{ fontSize: `${design.nameFontSize || 24}px` }}
        >
          {p.fullName || 'Dr. Academic Scholar'}
        </h1>
        {p.headline && (
          <p className="italic text-xs mt-1 text-stone-700">
            {p.headline}
          </p>
        )}
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-stone-600 font-sans">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {(p.city || p.country) && <span>• {[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.website && <span>• {p.website}</span>}
        </div>
      </div>

      {/* Research Interests */}
      {!hidden.has('summary') && p.summary && (
        <div className="mb-4">
          <h2 className="font-sans font-bold uppercase tracking-wider text-xs border-b border-stone-300 pb-0.5 mb-1.5" style={{ color: accent }}>
            Research Interests & Overview
          </h2>
          <p className="text-xs text-stone-800 leading-relaxed">{p.summary}</p>
        </div>
      )}

      {/* Academic Appointments / Experience */}
      {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="font-sans font-bold uppercase tracking-wider text-xs border-b border-stone-300 pb-0.5 mb-2" style={{ color: accent }}>
            Academic Appointments & Experience
          </h2>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-stone-900">
                  <span>{exp.jobTitle}, {exp.employer}</span>
                  <span className="font-sans font-normal text-stone-500">{exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}</span>
                </div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc ml-5 mt-1 space-y-0.5 text-stone-700">
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
        <div className="mb-4">
          <h2 className="font-sans font-bold uppercase tracking-wider text-xs border-b border-stone-300 pb-0.5 mb-2" style={{ color: accent }}>
            Education
          </h2>
          <div className="space-y-2 text-xs">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline font-bold text-stone-900">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="font-sans font-normal text-stone-500">{edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate}</span>
                </div>
                <div className="italic text-stone-700">{edu.institution}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publications */}
      {!hidden.has('publications') && data.publications && data.publications.length > 0 && (
        <div className="mb-4">
          <h2 className="font-sans font-bold uppercase tracking-wider text-xs border-b border-stone-300 pb-0.5 mb-2" style={{ color: accent }}>
            Peer-Reviewed Publications
          </h2>
          <ol className="list-decimal ml-5 space-y-1.5 text-xs text-stone-800">
            {data.publications.map((pub) => (
              <li key={pub.id}>
                <span className="font-bold text-stone-900">{pub.title}</span>. <em>{pub.publisher}</em>, {pub.date}.
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

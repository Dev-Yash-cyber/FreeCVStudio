import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';
import { renderRichText, groupExperiencesByCompany } from '../../utils/richText.js';

export const ModernCorporateTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#0284c7';
  const heading = design.headingColor || '#0f172a';
  const groupedExperiences = groupExperiencesByCompany(data.experience || []);

  return (
    <div className="w-full">
      {/* Top Header */}
      <div className="bg-slate-50 border-l-4 p-4 rounded-r mb-5" style={{ borderColor: accent }}>
        <h1
          className="font-bold tracking-tight"
          style={{ fontSize: `${design.nameFontSize || 26}px`, color: heading }}
        >
          {p.fullName || 'Your Name'}
        </h1>
        {p.headline && (
          <p className="font-semibold text-sm mt-0.5" style={{ color: accent }}>
            {p.headline}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-600">
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>☎ {p.phone}</span>}
          {(p.city || p.country) && <span>📍 {[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.linkedin && <span>in {p.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {!hidden.has('summary') && p.summary && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }}></span>
            <h2 className="font-bold uppercase tracking-wider text-xs" style={{ color: heading }}>
              Executive Profile
            </h2>
          </div>
          <div className="text-slate-700 leading-relaxed text-xs">{renderRichText(p.summary)}</div>
        </div>
      )}

      {/* Experience */}
      {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }}></span>
            <h2 className="font-bold uppercase tracking-wider text-xs" style={{ color: heading }}>
              Work Experience
            </h2>
          </div>
          <div className="space-y-3.5">
            {groupedExperiences.map((group, gIdx) => {
              if (group.isMultiple) {
                return (
                  <div key={gIdx} className="space-y-2">
                    <div className="font-bold text-xs" style={{ color: accent }}>
                      {group.employer}
                    </div>
                    <div className="border-l-2 pl-3 space-y-3 ml-1" style={{ borderColor: accent }}>
                      {group.positions.map((pos) => (
                        <div key={pos.id}>
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-xs text-slate-900">{pos.jobTitle}</span>
                            <span className="text-xs text-slate-500 font-medium">
                              {pos.startDate} - {pos.isCurrent ? 'Present' : pos.endDate}
                            </span>
                          </div>
                          {pos.location && <div className="text-[11px] text-slate-400">{pos.location}</div>}
                          {pos.responsibilities && (
                            <div className="text-xs text-slate-700 mt-1 leading-relaxed">
                              {renderRichText(pos.responsibilities)}
                            </div>
                          )}
                          {pos.bulletPoints && pos.bulletPoints.length > 0 && (
                            <ul className="list-disc ml-4 space-y-0.5 text-xs text-slate-700 mt-1">
                              {pos.bulletPoints.map((bp, i) => (
                                <li key={i}>{renderRichText(bp)}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              const exp = group.positions[0];
              return (
                <div key={exp.id} className="relative pl-3 border-l-2 border-slate-200">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-slate-900">{exp.jobTitle}</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mb-1" style={{ color: accent }}>
                    {exp.employer} {exp.location ? `• ${exp.location}` : ''}
                  </div>
                  {exp.responsibilities && (
                    <div className="text-xs text-slate-700 mt-1 mb-1 leading-relaxed">
                      {renderRichText(exp.responsibilities)}
                    </div>
                  )}
                  {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                    <ul className="list-disc ml-4 space-y-0.5 text-xs text-slate-700">
                      {exp.bulletPoints.map((bp, i) => (
                        <li key={i}>{renderRichText(bp)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Education */}
      {!hidden.has('education') && data.education && data.education.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }}></span>
            <h2 className="font-bold uppercase tracking-wider text-xs" style={{ color: heading }}>
              Education & Credentials
            </h2>
          </div>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <span className="text-slate-600">, {edu.fieldOfStudy}</span>
                  <span className="text-slate-500"> — {edu.institution}</span>
                </div>
                <span className="text-slate-500">{edu.startDate} - {edu.isCurrent ? 'Present' : edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }}></span>
            <h2 className="font-bold uppercase tracking-wider text-xs" style={{ color: heading }}>
              Core Competencies
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {data.skillCategories.map((cat) => (
              <div key={cat.id} className="bg-slate-50 p-2 rounded">
                <span className="font-bold text-slate-800 block mb-1">{cat.categoryName}</span>
                <span className="text-slate-600">{cat.skills.map((s) => s.name).join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {!hidden.has('projects') && data.projects && data.projects.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }}></span>
            <h2 className="font-bold uppercase tracking-wider text-xs" style={{ color: heading }}>
              Key Projects
            </h2>
          </div>
          <div className="space-y-2.5">
            {data.projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{proj.name}</span>
                  {proj.startDate && (
                    <span className="text-slate-400 font-normal">
                      {proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ''}
                    </span>
                  )}
                </div>
                {proj.description && <p className="text-slate-600 mt-0.5">{proj.description}</p>}
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    <span className="font-semibold">Tech:</span> {proj.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {!hidden.has('certifications') && data.certifications && data.certifications.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }}></span>
            <h2 className="font-bold uppercase tracking-wider text-xs" style={{ color: heading }}>
              Certifications
            </h2>
          </div>
          <div className="space-y-1.5">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-slate-900">{cert.name}</span>
                  <span className="text-slate-600"> — {cert.issuer}</span>
                </div>
                {cert.issueDate && <span className="text-slate-400">{cert.issueDate}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Honors & Awards */}
      {!hidden.has('awards') && data.awards && data.awards.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }}></span>
            <h2 className="font-bold uppercase tracking-wider text-xs" style={{ color: heading }}>
              Honors & Awards
            </h2>
          </div>
          <div className="space-y-1.5">
            {data.awards.map((award) => (
              <div key={award.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-slate-900">{award.title}</span>
                  <span className="text-slate-600"> — {award.issuer}</span>
                </div>
                {award.date && <span className="text-slate-400">{award.date}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Volunteering */}
      {!hidden.has('volunteering') && data.volunteering && data.volunteering.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }}></span>
            <h2 className="font-bold uppercase tracking-wider text-xs" style={{ color: heading }}>
              Volunteering & Leadership
            </h2>
          </div>
          <div className="space-y-2">
            {data.volunteering.map((vol) => (
              <div key={vol.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{vol.role}</span>
                    <span className="text-slate-600"> — {vol.organization}</span>
                  </div>
                  <span className="text-slate-400">{vol.startDate} – {vol.endDate || 'Present'}</span>
                </div>
                {vol.bulletPoints && vol.bulletPoints.length > 0 && (
                  <ul className="list-disc ml-4 space-y-0.5 text-slate-600 mt-1">
                    {vol.bulletPoints.map((bp, i) => (
                      <li key={i}>{renderRichText(bp)}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Publications */}
      {!hidden.has('publications') && data.publications && data.publications.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }}></span>
            <h2 className="font-bold uppercase tracking-wider text-xs" style={{ color: heading }}>
              Publications & Research
            </h2>
          </div>
          <div className="space-y-2">
            {data.publications.map((pub) => (
              <div key={pub.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{pub.title}</span>
                  {pub.date && <span className="text-slate-400">{pub.date}</span>}
                </div>
                <div className="text-slate-600">
                  {pub.publisher}
                  {pub.url && (
                    <a href={pub.url} target="_blank" rel="noreferrer" className="text-blue-600 ml-2 hover:underline">
                      Link ↗
                    </a>
                  )}
                </div>
                {pub.description && <p className="text-slate-600 mt-0.5">{pub.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Sections (Courses, Declaration, Custom) */}
      {data.customSections &&
        data.customSections.map((sec) => (
          <div key={sec.id} className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }}></span>
              <h2 className="font-bold uppercase tracking-wider text-xs" style={{ color: heading }}>
                {sec.sectionTitle}
              </h2>
            </div>
            <div className="space-y-2">
              {sec.items.map((item) => (
                <div key={item.id} className="text-xs">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-slate-900">{item.title}</span>
                      {item.subtitle && <span className="text-slate-600"> — {item.subtitle}</span>}
                    </div>
                    {item.date && <span className="text-slate-400">{item.date}</span>}
                  </div>
                  {item.description && (
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{renderRichText(item.description)}</p>
                  )}
                  {item.bulletPoints && item.bulletPoints.length > 0 && (
                    <ul className="list-disc ml-4 space-y-0.5 text-slate-600 mt-1">
                      {item.bulletPoints.map((bp, i) => (
                        <li key={i}>{renderRichText(bp)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

      {/* References */}
      {!hidden.has('references') && data.references && data.references.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }}></span>
            <h2 className="font-bold uppercase tracking-wider text-xs" style={{ color: heading }}>
              References
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {data.references.map((ref) => (
              <div key={ref.id} className="bg-slate-50 p-2 rounded">
                <div className="font-bold text-slate-900">{ref.name}</div>
                <div className="text-slate-600">{ref.title} — {ref.company}</div>
                {ref.email && <div className="text-slate-500">{ref.email}</div>}
                {ref.phone && <div className="text-slate-500">{ref.phone}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {!hidden.has('interests') && data.interests && data.interests.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accent }}></span>
            <h2 className="font-bold uppercase tracking-wider text-xs" style={{ color: heading }}>
              Interests & Activities
            </h2>
          </div>
          <p className="text-xs text-slate-600">{data.interests.join(' • ')}</p>
        </div>
      )}
    </div>
  );
};

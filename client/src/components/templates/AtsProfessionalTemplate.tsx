import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';
import { renderRichText, groupExperiencesByCompany } from '../../utils/richText.js';

export const AtsProfessionalTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#1e3a8a';
  const heading = design.headingColor || '#0f172a';
  const groupedExperiences = groupExperiencesByCompany(data.experience || []);

  return (
    <div className="w-full">
      {/* Header */}
      <header className="border-b-2 pb-3 mb-4" style={{ borderColor: accent }}>
        <h1
          className="font-bold tracking-tight"
          style={{ fontSize: `${design.nameFontSize || 26}px`, color: heading }}
        >
          {p.fullName || 'Your Name'}
        </h1>
        {p.headline && (
          <p className="font-semibold mt-0.5" style={{ color: accent, fontSize: '14px' }}>
            {p.headline}
          </p>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-slate-600">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {(p.city || p.country) && <span>• {[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.linkedin && <span>• {p.linkedin}</span>}
          {p.github && <span>• {p.github}</span>}
          {p.website && <span>• {p.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {!hidden.has('summary') && p.summary && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2"
            style={{ color: heading, borderColor: '#cbd5e1' }}
          >
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-relaxed">{renderRichText(p.summary)}</p>
        </section>
      )}

      {/* Experience */}
      {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2"
            style={{ color: heading, borderColor: '#cbd5e1' }}
          >
            Professional Experience
          </h2>
          <div className="space-y-4">
            {groupedExperiences.map((group, gIdx) => {
              if (group.isMultiple) {
                // Grouped multi-role presentation matching FlowCV Screenshot 2
                return (
                  <div key={gIdx} className="space-y-2">
                    <div className="font-bold text-slate-900 text-sm">{group.employer}</div>
                    <div className="border-l-2 border-slate-300 pl-3.5 space-y-3.5 ml-1">
                      {group.positions.map((pos) => (
                        <div key={pos.id} className="relative">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-slate-900 text-xs">{pos.jobTitle}</span>
                            <div className="text-right">
                              <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
                                {pos.startDate} – {pos.isCurrent ? 'Present' : pos.endDate}
                              </span>
                              {pos.location && <div className="text-[11px] text-slate-500">{pos.location}</div>}
                            </div>
                          </div>
                          {pos.responsibilities && (
                            <div className="text-xs text-slate-700 mt-1 leading-relaxed">
                              {renderRichText(pos.responsibilities)}
                            </div>
                          )}
                          {pos.bulletPoints && pos.bulletPoints.length > 0 && (
                            <ul className="list-disc ml-4 mt-1 space-y-0.5 text-slate-700 text-xs">
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

              // Single position at employer
              const exp = group.positions[0];
              return (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-slate-900">{exp.jobTitle}</span>
                      <span className="text-slate-700"> — {exp.employer}</span>
                      {exp.location && <span className="text-slate-500 text-xs">, {exp.location}</span>}
                    </div>
                    <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  {exp.responsibilities && (
                    <div className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {renderRichText(exp.responsibilities)}
                    </div>
                  )}
                  {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                    <ul className="list-disc ml-5 mt-1 space-y-0.5 text-slate-700 text-xs">
                      {exp.bulletPoints.map((bp, i) => (
                        <li key={i}>{renderRichText(bp)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Education */}
      {!hidden.has('education') && data.education && data.education.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2"
            style={{ color: heading, borderColor: '#cbd5e1' }}
          >
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900">{edu.degree}</span>
                  <span className="text-slate-700"> in {edu.fieldOfStudy}</span>
                  <span className="text-slate-600 text-xs"> — {edu.institution}</span>
                  {edu.gpa && <span className="text-slate-500 text-xs ml-2">(GPA: {edu.gpa})</span>}
                </div>
                <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
                  {edu.startDate} – {edu.isCurrent ? 'Present' : edu.endDate}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2"
            style={{ color: heading, borderColor: '#cbd5e1' }}
          >
            Skills & Competencies
          </h2>
          <div className="space-y-1.5">
            {data.skillCategories.map((cat) => (
              <div key={cat.id} className="text-xs">
                <span className="font-bold text-slate-800">{cat.categoryName}: </span>
                <span className="text-slate-700">{cat.skills.map((s) => s.name).join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {!hidden.has('projects') && data.projects && data.projects.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2"
            style={{ color: heading, borderColor: '#cbd5e1' }}
          >
            Key Projects
          </h2>
          <div className="space-y-2.5">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <div className="font-bold text-slate-900">
                    {proj.name}
                    {proj.role && <span className="font-normal text-xs text-slate-600"> ({proj.role})</span>}
                  </div>
                  {proj.startDate && (
                    <div className="text-xs text-slate-500">{proj.startDate} – {proj.endDate || 'Present'}</div>
                  )}
                </div>
                <p className="text-xs text-slate-700 mt-0.5">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-xs font-medium text-slate-600 mt-0.5">
                    Stack: {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {!hidden.has('certifications') && data.certifications && data.certifications.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2"
            style={{ color: heading, borderColor: '#cbd5e1' }}
          >
            Certifications
          </h2>
          <div className="space-y-1">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-slate-900">{cert.name}</span>
                  <span className="text-slate-600"> — {cert.issuer}</span>
                </div>
                {cert.issueDate && <span className="text-slate-500">{cert.issueDate}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Honors & Awards */}
      {!hidden.has('awards') && data.awards && data.awards.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2"
            style={{ color: heading, borderColor: '#cbd5e1' }}
          >
            Honors & Awards
          </h2>
          <div className="space-y-1">
            {data.awards.map((award) => (
              <div key={award.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-bold text-slate-900">{award.title}</span>
                  <span className="text-slate-600"> — {award.issuer}</span>
                </div>
                {award.date && <span className="text-slate-500">{award.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteering & Leadership */}
      {!hidden.has('volunteering') && data.volunteering && data.volunteering.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2"
            style={{ color: heading, borderColor: '#cbd5e1' }}
          >
            Volunteering & Leadership
          </h2>
          <div className="space-y-2">
            {data.volunteering.map((vol) => (
              <div key={vol.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{vol.role}</span>
                    <span className="text-slate-700"> — {vol.organization}</span>
                  </div>
                  <span className="text-slate-500">{vol.startDate} – {vol.endDate || 'Present'}</span>
                </div>
                {vol.bulletPoints && vol.bulletPoints.length > 0 && (
                  <ul className="list-disc ml-5 mt-1 space-y-0.5 text-slate-700">
                    {vol.bulletPoints.map((bp, i) => (
                      <li key={i}>{renderRichText(bp)}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications & Research */}
      {!hidden.has('publications') && data.publications && data.publications.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2"
            style={{ color: heading, borderColor: '#cbd5e1' }}
          >
            Publications & Research
          </h2>
          <div className="space-y-1.5">
            {data.publications.map((pub) => (
              <div key={pub.id} className="text-xs">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{pub.title}</span>
                  {pub.date && <span className="text-slate-500">{pub.date}</span>}
                </div>
                <div className="text-slate-600">
                  {pub.publisher}
                  {pub.url && (
                    <a href={pub.url} target="_blank" rel="noreferrer" className="text-blue-600 ml-2 hover:underline">
                      Link ↗
                    </a>
                  )}
                </div>
                {pub.description && <p className="text-slate-700 mt-0.5">{pub.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections (Courses, Declaration, Bespoke) */}
      {data.customSections &&
        data.customSections.map((sec) => (
          <section key={sec.id} className="mb-4">
            <h2
              className="font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2"
              style={{ color: heading, borderColor: '#cbd5e1' }}
            >
              {sec.sectionTitle}
            </h2>
            <div className="space-y-2">
              {sec.items.map((item) => (
                <div key={item.id} className="text-xs">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-slate-900">{item.title}</span>
                      {item.subtitle && <span className="text-slate-600"> — {item.subtitle}</span>}
                    </div>
                    {item.date && <span className="text-slate-500">{item.date}</span>}
                  </div>
                  {item.description && (
                    <p className="text-slate-700 mt-0.5 leading-relaxed">{renderRichText(item.description)}</p>
                  )}
                  {item.bulletPoints && item.bulletPoints.length > 0 && (
                    <ul className="list-disc ml-5 mt-1 space-y-0.5 text-slate-700">
                      {item.bulletPoints.map((bp, i) => (
                        <li key={i}>{renderRichText(bp)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

      {/* Professional References */}
      {!hidden.has('references') && data.references && data.references.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2"
            style={{ color: heading, borderColor: '#cbd5e1' }}
          >
            References
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {data.references.map((ref) => (
              <div key={ref.id} className="space-y-0.5">
                <div className="font-bold text-slate-900">{ref.name}</div>
                <div className="text-slate-600">{ref.title} — {ref.company}</div>
                {ref.email && <div className="text-slate-500">{ref.email}</div>}
                {ref.phone && <div className="text-slate-500">{ref.phone}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interests */}
      {!hidden.has('interests') && data.interests && data.interests.length > 0 && (
        <section className="mb-4">
          <h2
            className="font-bold uppercase tracking-wider text-xs border-b pb-1 mb-2"
            style={{ color: heading, borderColor: '#cbd5e1' }}
          >
            Interests & Activities
          </h2>
          <p className="text-xs text-slate-700">{data.interests.join(' • ')}</p>
        </section>
      )}
    </div>
  );
};

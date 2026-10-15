import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';
import { renderRichText, groupExperiencesByCompany } from '../../utils/richText.js';

export const MinimalCleanTemplate: React.FC<{ data: ResumeData; design: DesignSettings }> = ({
  data,
  design,
}) => {
  const p = data.personalInfo || ({} as any);
  const hidden = new Set(data.hiddenSections || []);
  const accent = design.accentColor || '#0f172a';
  const groupedExperiences = groupExperiencesByCompany(data.experience || []);

  return (
    <div className="w-full tracking-wide">
      {/* Header */}
      <header className="mb-6">
        <h1
          className="font-light tracking-tight text-slate-900"
          style={{ fontSize: `${design.nameFontSize || 28}px` }}
        >
          {p.fullName || 'Your Name'}
        </h1>
        {p.headline && (
          <p className="text-slate-500 font-normal tracking-wide uppercase text-xs mt-1">
            {p.headline}
          </p>
        )}
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-400">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {(p.city || p.country) && <span>{[p.city, p.country].filter(Boolean).join(', ')}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
          {p.github && <span>{p.github}</span>}
        </div>
      </header>

      {/* Summary */}
      {!hidden.has('summary') && p.summary && (
        <section className="mb-6">
          <div className="text-slate-600 leading-relaxed font-light text-xs">
            {renderRichText(p.summary)}
          </div>
        </section>
      )}

      {/* Experience */}
      {!hidden.has('experience') && data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Experience
          </h2>
          <div className="space-y-4">
            {groupedExperiences.map((group, gIdx) => {
              if (group.isMultiple) {
                return (
                  <div key={gIdx} className="space-y-2">
                    <div className="font-medium text-slate-900 text-xs">
                      {group.employer}
                    </div>
                    <div className="border-l border-slate-300 pl-3 space-y-3 ml-1">
                      {group.positions.map((pos) => (
                        <div key={pos.id}>
                          <div className="flex justify-between items-baseline mb-0.5">
                            <span className="font-normal text-slate-800 text-xs">{pos.jobTitle}</span>
                            <span className="text-xs text-slate-400 font-light">
                              {pos.startDate} — {pos.isCurrent ? 'Present' : pos.endDate}
                              {pos.location ? ` | ${pos.location}` : ''}
                            </span>
                          </div>
                          {pos.responsibilities && (
                            <div className="text-slate-600 text-xs font-light mb-1">
                              {renderRichText(pos.responsibilities)}
                            </div>
                          )}
                          {pos.bulletPoints && pos.bulletPoints.length > 0 && (
                            <ul className="space-y-1 text-slate-600 text-xs font-light">
                              {pos.bulletPoints.map((bp, i) => (
                                <li key={i} className="flex items-start">
                                  <span className="text-slate-300 mr-2">—</span>
                                  <span>{renderRichText(bp)}</span>
                                </li>
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
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div>
                      <span className="font-medium text-slate-800">{exp.jobTitle}</span>
                      <span className="text-slate-400"> / {exp.employer}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-light">
                      {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.responsibilities && (
                    <div className="text-slate-600 text-xs font-light mb-1">
                      {renderRichText(exp.responsibilities)}
                    </div>
                  )}
                  {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                    <ul className="space-y-1 text-slate-600 text-xs font-light">
                      {exp.bulletPoints.map((bp, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-slate-300 mr-2">—</span>
                          <span>{renderRichText(bp)}</span>
                        </li>
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
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Education
          </h2>
          <div className="space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline text-xs">
                <div>
                  <span className="font-medium text-slate-800">{edu.degree}</span>
                  <span className="text-slate-500">, {edu.fieldOfStudy}</span>
                  <span className="text-slate-400"> — {edu.institution}</span>
                </div>
                <span className="text-slate-400 font-light">{edu.startDate} — {edu.isCurrent ? 'Present' : edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {!hidden.has('skills') && data.skillCategories && data.skillCategories.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Skills
          </h2>
          <div className="space-y-1">
            {data.skillCategories.map((cat) => (
              <div key={cat.id} className="text-xs">
                <span className="text-slate-400">{cat.categoryName}: </span>
                <span className="text-slate-700 font-light">{cat.skills.map((s) => s.name).join(' · ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {!hidden.has('projects') && data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
            Projects
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between items-baseline font-medium text-slate-800">
                  <span>{proj.name}</span>
                  {proj.startDate && <span className="font-light text-slate-400">{proj.startDate}</span>}
                </div>
                <p className="text-slate-500 font-light mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {!hidden.has('certifications') && data.certifications && data.certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Certifications
          </h2>
          <div className="space-y-1.5">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline text-xs font-light">
                <div>
                  <span className="font-medium text-slate-800">{cert.name}</span>
                  <span className="text-slate-400"> — {cert.issuer}</span>
                </div>
                {cert.issueDate && <span className="text-slate-400">{cert.issueDate}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Honors & Awards */}
      {!hidden.has('awards') && data.awards && data.awards.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Honors & Awards
          </h2>
          <div className="space-y-1.5">
            {data.awards.map((award) => (
              <div key={award.id} className="flex justify-between items-baseline text-xs font-light">
                <div>
                  <span className="font-medium text-slate-800">{award.title}</span>
                  <span className="text-slate-400"> — {award.issuer}</span>
                </div>
                {award.date && <span className="text-slate-400">{award.date}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Volunteering */}
      {!hidden.has('volunteering') && data.volunteering && data.volunteering.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Volunteering
          </h2>
          <div className="space-y-2">
            {data.volunteering.map((vol) => (
              <div key={vol.id} className="text-xs font-light">
                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="font-medium text-slate-800">{vol.role}</span>
                    <span className="text-slate-400"> — {vol.organization}</span>
                  </div>
                  <span className="text-slate-400">{vol.startDate} – {vol.endDate || 'Present'}</span>
                </div>
                {vol.bulletPoints && vol.bulletPoints.length > 0 && (
                  <ul className="space-y-0.5 text-slate-600 mt-1">
                    {vol.bulletPoints.map((bp, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-slate-300 mr-2">—</span>
                        <span>{renderRichText(bp)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {!hidden.has('publications') && data.publications && data.publications.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Publications
          </h2>
          <div className="space-y-2">
            {data.publications.map((pub) => (
              <div key={pub.id} className="text-xs font-light">
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-slate-800">{pub.title}</span>
                  {pub.date && <span className="text-slate-400">{pub.date}</span>}
                </div>
                <div className="text-slate-400">
                  {pub.publisher}
                  {pub.url && (
                    <a href={pub.url} target="_blank" rel="noreferrer" className="text-slate-600 underline ml-2">
                      Link
                    </a>
                  )}
                </div>
                {pub.description && <p className="text-slate-500 mt-0.5">{pub.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Custom Sections (Courses, Declaration, Custom) */}
      {data.customSections &&
        data.customSections.map((sec) => (
          <section key={sec.id} className="mb-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
              {sec.sectionTitle}
            </h2>
            <div className="space-y-2">
              {sec.items.map((item) => (
                <div key={item.id} className="text-xs font-light">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-medium text-slate-800">{item.title}</span>
                      {item.subtitle && <span className="text-slate-400"> — {item.subtitle}</span>}
                    </div>
                    {item.date && <span className="text-slate-400">{item.date}</span>}
                  </div>
                  {item.description && (
                    <p className="text-slate-600 mt-0.5 leading-relaxed">{renderRichText(item.description)}</p>
                  )}
                  {item.bulletPoints && item.bulletPoints.length > 0 && (
                    <ul className="space-y-0.5 text-slate-600 mt-1">
                      {item.bulletPoints.map((bp, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-slate-300 mr-2">—</span>
                          <span>{renderRichText(bp)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

      {/* References */}
      {!hidden.has('references') && data.references && data.references.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            References
          </h2>
          <div className="grid grid-cols-2 gap-3 text-xs font-light">
            {data.references.map((ref) => (
              <div key={ref.id} className="space-y-0.5">
                <div className="font-medium text-slate-800">{ref.name}</div>
                <div className="text-slate-500">{ref.title} — {ref.company}</div>
                {ref.email && <div className="text-slate-400">{ref.email}</div>}
                {ref.phone && <div className="text-slate-400">{ref.phone}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interests */}
      {!hidden.has('interests') && data.interests && data.interests.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Interests
          </h2>
          <p className="text-xs text-slate-600 font-light">{data.interests.join(' · ')}</p>
        </section>
      )}
    </div>
  );
};

import * as docxModule from 'docx';
const {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Packer,
  BorderStyle,
  TabStopType,
} = (docxModule as any).default || docxModule;
import { ResumeData, DesignSettings, CoverLetterData, ExperienceItem } from '../types/index.js';

/**
 * Parses markdown / HTML formatting (**bold**, *italic*, <u>underline</u>)
 * into native Microsoft Word TextRun objects.
 */
function parseRichTextToDocxRuns(
  text: string,
  defaultSize = 20,
  font = 'Calibri',
  defaultColor?: string
): any[] {
  if (!text) return [];

  // Strip div wrappers cleanly
  const clean = text.replace(/<div\s+align="[^"]*">/gi, '').replace(/<\/div>/gi, '');

  const regex = /(\*\*([^*]+)\*\*|<b>([^<]+)<\/b>|<strong>([^<]+)<\/strong>|\*([^*]+)\*|<em>([^<]+)<\/em>|<i>([^<]+)<\/i>|<u>([^<]+)<\/u>)/g;
  const runs: any[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(clean)) !== null) {
    if (match.index > lastIndex) {
      runs.push(
        new TextRun({
          text: clean.substring(lastIndex, match.index),
          size: defaultSize,
          font,
          color: defaultColor,
        })
      );
    }

    const full = match[0];
    if (full.startsWith('**') || full.startsWith('<b>') || full.startsWith('<strong>')) {
      runs.push(
        new TextRun({
          text: match[2] || match[3] || match[4],
          bold: true,
          size: defaultSize,
          font,
          color: defaultColor,
        })
      );
    } else if (full.startsWith('<u>')) {
      runs.push(
        new TextRun({
          text: match[8],
          underline: {},
          size: defaultSize,
          font,
          color: defaultColor,
        })
      );
    } else {
      runs.push(
        new TextRun({
          text: match[5] || match[6] || match[7],
          italics: true,
          size: defaultSize,
          font,
          color: defaultColor,
        })
      );
    }

    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    runs.push(
      new TextRun({
        text: text.substring(lastIndex),
        size: defaultSize,
        font,
        color: defaultColor,
      })
    );
  }

  return runs;
}

interface GroupedDocxExperience {
  employer: string;
  positions: ExperienceItem[];
  isMultiple: boolean;
}

function groupExperiences(experiences: ExperienceItem[]): GroupedDocxExperience[] {
  if (!experiences || experiences.length === 0) return [];

  const groups: GroupedDocxExperience[] = [];
  const map = new Map<string, GroupedDocxExperience>();

  experiences.forEach((exp) => {
    const employerTrimmed = (exp.employer || '').trim();
    const key = employerTrimmed.toLowerCase();

    if (key && map.has(key)) {
      const existing = map.get(key)!;
      existing.positions.push(exp);
      existing.isMultiple = true;
    } else {
      const newGroup: GroupedDocxExperience = {
        employer: exp.employer || 'Company',
        positions: [exp],
        isMultiple: false,
      };
      groups.push(newGroup);
      if (key) {
        map.set(key, newGroup);
      }
    }
  });
  return groups;
}

export async function generateResumeDocx(
  data: ResumeData,
  design: DesignSettings
): Promise<Buffer> {
  const p = data.personalInfo || ({} as any);
  const experiences = data.experience || [];
  const educations = data.education || [];
  const skillCats = data.skillCategories || [];
  const projects = data.projects || [];
  const certifications = data.certifications || [];
  const awards = data.awards || [];
  const customSections = data.customSections || [];

  const font = design.fontFamily || 'Calibri';
  const primaryColor = (design.accentColor || '#1e3a8a').replace('#', '');
  const textColor = (design.textColor || '#1e293b').replace('#', '');

  const children: any[] = [];

  // 1. Candidate Full Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: p.fullName || 'Untitled Resume',
          bold: true,
          size: 32,
          font,
          color: primaryColor,
        }),
      ],
    })
  );

  // 2. Headline
  if (p.headline) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 50, after: 80 },
        children: [
          new TextRun({
            text: p.headline,
            bold: true,
            size: 22,
            font,
            color: '4B5563',
          }),
        ],
      })
    );
  }

  // 3. Contact Details
  const contactParts = [
    p.email,
    p.phone,
    [p.city, p.country].filter(Boolean).join(', '),
    p.linkedin,
    p.github,
    p.website,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactParts.join('  •  '),
            size: 18,
            font,
            color: '6B7280',
          }),
        ],
      })
    );
  }

  // Section Heading Builder Helper
  const createSectionHeading = (title: string) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      border: {
        bottom: { color: primaryColor, space: 1, value: BorderStyle.SINGLE, size: 6 },
      },
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 21,
          font,
          color: primaryColor,
        }),
      ],
    });
  };

  // 4. Professional Summary
  if (p.summary) {
    children.push(createSectionHeading('Professional Summary'));
    const summaryRuns = parseRichTextToDocxRuns(p.summary, 20, font, textColor);
    children.push(
      new Paragraph({
        spacing: { after: 180 },
        children: summaryRuns.length > 0 ? summaryRuns : [new TextRun({ text: p.summary, size: 20, font })],
      })
    );
  }

  // 5. Work Experience (with multiple positions under same company support!)
  if (experiences.length > 0) {
    children.push(createSectionHeading('Work Experience'));
    const grouped = groupExperiences(experiences);

    grouped.forEach((group) => {
      if (group.isMultiple) {
        // Company Name Once
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({
                text: group.employer,
                bold: true,
                size: 21,
                font,
                color: '111827',
              }),
            ],
          })
        );

        // Multiple sub-positions
        group.positions.forEach((pos) => {
          const dateStr = `${pos.startDate} – ${pos.isCurrent ? 'Present' : pos.endDate}${pos.location ? ` | ${pos.location}` : ''}`;
          children.push(
            new Paragraph({
              spacing: { before: 80, after: 30 },
              tabStops: [{ type: TabStopType.RIGHT, position: 9070 }],
              children: [
                new TextRun({
                  text: pos.jobTitle,
                  bold: true,
                  size: 20,
                  font,
                  color: primaryColor,
                }),
                new TextRun({ text: '\t' }),
                new TextRun({
                  text: dateStr,
                  italics: true,
                  size: 18,
                  font,
                  color: '6B7280',
                }),
              ],
            })
          );

          if (pos.responsibilities && pos.responsibilities.trim()) {
            const runs = parseRichTextToDocxRuns(pos.responsibilities, 19, font, textColor);
            children.push(
              new Paragraph({
                spacing: { after: 40 },
                children: runs.length > 0 ? runs : [new TextRun({ text: pos.responsibilities, size: 19, font })],
              })
            );
          }

          (pos.bulletPoints || []).forEach((bp) => {
            if (!bp.trim()) return;
            const runs = parseRichTextToDocxRuns(bp, 19, font, textColor);
            children.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { after: 30 },
                children: runs.length > 0 ? runs : [new TextRun({ text: bp, size: 19, font })],
              })
            );
          });
        });
      } else {
        // Single position at employer
        const exp = group.positions[0];
        const dateStr = `${exp.startDate} – ${exp.isCurrent ? 'Present' : exp.endDate}${exp.location ? ` | ${exp.location}` : ''}`;
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 30 },
            tabStops: [{ type: TabStopType.RIGHT, position: 9070 }],
            children: [
              new TextRun({
                text: `${exp.jobTitle}`,
                bold: true,
                size: 20,
                font,
                color: '111827',
              }),
              new TextRun({
                text: ` — ${exp.employer}`,
                bold: false,
                size: 20,
                font,
                color: '374151',
              }),
              new TextRun({ text: '\t' }),
              new TextRun({
                text: dateStr,
                italics: true,
                size: 18,
                font,
                color: '6B7280',
              }),
            ],
          })
        );

        if (exp.responsibilities && exp.responsibilities.trim()) {
          const runs = parseRichTextToDocxRuns(exp.responsibilities, 19, font, textColor);
          children.push(
            new Paragraph({
              spacing: { after: 40 },
              children: runs.length > 0 ? runs : [new TextRun({ text: exp.responsibilities, size: 19, font })],
            })
          );
        }

        (exp.bulletPoints || []).forEach((bp) => {
          if (!bp.trim()) return;
          const runs = parseRichTextToDocxRuns(bp, 19, font, textColor);
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 30 },
              children: runs.length > 0 ? runs : [new TextRun({ text: bp, size: 19, font })],
            })
          );
        });
      }
    });
  }

  // 6. Education
  if (educations.length > 0) {
    children.push(createSectionHeading('Education'));
    educations.forEach((edu) => {
      const dateStr = `${edu.startDate} – ${edu.isCurrent ? 'Present' : edu.endDate}`;
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          tabStops: [{ type: TabStopType.RIGHT, position: 9070 }],
          children: [
            new TextRun({
              text: `${edu.degree} in ${edu.fieldOfStudy}`,
              bold: true,
              size: 20,
              font,
              color: '111827',
            }),
            new TextRun({
              text: ` — ${edu.institution}${edu.gpa ? ` (GPA: ${edu.gpa})` : ''}`,
              size: 19,
              font,
              color: '4B5563',
            }),
            new TextRun({ text: '\t' }),
            new TextRun({
              text: dateStr,
              italics: true,
              size: 18,
              font,
              color: '6B7280',
            }),
          ],
        })
      );
    });
  }

  // 7. Skills & Expertise
  if (skillCats.length > 0) {
    children.push(createSectionHeading('Skills & Competencies'));
    skillCats.forEach((sc) => {
      const skillsStr = (sc.skills || []).map((s) => s.name).join(', ');
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${sc.categoryName}: `,
              bold: true,
              size: 19,
              font,
              color: '111827',
            }),
            new TextRun({
              text: skillsStr,
              size: 19,
              font,
              color: textColor,
            }),
          ],
        })
      );
    });
  }

  // 8. Key Projects
  if (projects.length > 0) {
    children.push(createSectionHeading('Projects'));
    projects.forEach((proj) => {
      const dateStr = proj.startDate ? `${proj.startDate}${proj.endDate ? ` – ${proj.endDate}` : ''}` : '';
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          tabStops: [{ type: TabStopType.RIGHT, position: 9070 }],
          children: [
            new TextRun({
              text: proj.name,
              bold: true,
              size: 20,
              font,
              color: '111827',
            }),
            ...(proj.role
              ? [new TextRun({ text: ` (${proj.role})`, italics: true, size: 18, font, color: '6B7280' })]
              : []),
            new TextRun({ text: '\t' }),
            new TextRun({ text: dateStr, italics: true, size: 18, font, color: '6B7280' }),
          ],
        })
      );

      if (proj.description) {
        const descRuns = parseRichTextToDocxRuns(proj.description, 19, font, textColor);
        children.push(
          new Paragraph({
            spacing: { after: 30 },
            children: descRuns.length > 0 ? descRuns : [new TextRun({ text: proj.description, size: 19, font })],
          })
        );
      }

      (proj.bulletPoints || []).forEach((bp) => {
        if (!bp.trim()) return;
        const runs = parseRichTextToDocxRuns(bp, 19, font, textColor);
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 20 },
            children: runs.length > 0 ? runs : [new TextRun({ text: bp, size: 19, font })],
          })
        );
      });

      if (proj.technologies && proj.technologies.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: 'Technologies: ', bold: true, size: 17, font, color: '6B7280' }),
              new TextRun({ text: proj.technologies.join(', '), size: 17, font, color: '4B5563' }),
            ],
          })
        );
      }
    });
  }

  // 9. Certifications
  if (certifications.length > 0) {
    children.push(createSectionHeading('Certifications & Licences'));
    certifications.forEach((c) => {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 20 },
          tabStops: [{ type: TabStopType.RIGHT, position: 9070 }],
          children: [
            new TextRun({ text: c.name, bold: true, size: 19, font, color: '111827' }),
            new TextRun({ text: ` — ${c.issuer}`, size: 19, font, color: '4B5563' }),
            new TextRun({ text: '\t' }),
            new TextRun({ text: c.issueDate || '', italics: true, size: 18, font, color: '6B7280' }),
          ],
        })
      );
    });
  }

  // 10. Awards
  if (awards.length > 0) {
    children.push(createSectionHeading('Honors & Awards'));
    awards.forEach((a) => {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 20 },
          tabStops: [{ type: TabStopType.RIGHT, position: 9070 }],
          children: [
            new TextRun({ text: a.title, bold: true, size: 19, font, color: '111827' }),
            new TextRun({ text: ` — ${a.issuer}`, size: 19, font, color: '4B5563' }),
            new TextRun({ text: '\t' }),
            new TextRun({ text: a.date || '', italics: true, size: 18, font, color: '6B7280' }),
          ],
        })
      );
    });
  }

  // 11. Custom Sections (Courses, Declaration, etc.)
  if (customSections.length > 0) {
    customSections.forEach((cs) => {
      children.push(createSectionHeading(cs.sectionTitle || 'Additional Information'));
      (cs.items || []).forEach((item) => {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            tabStops: [{ type: TabStopType.RIGHT, position: 9070 }],
            children: [
              new TextRun({ text: item.title, bold: true, size: 19, font, color: '111827' }),
              ...(item.subtitle ? [new TextRun({ text: ` — ${item.subtitle}`, size: 19, font, color: '4B5563' })] : []),
              new TextRun({ text: '\t' }),
              new TextRun({ text: item.date || '', italics: true, size: 18, font, color: '6B7280' }),
            ],
          })
        );
        if (item.description) {
          const descRuns = parseRichTextToDocxRuns(item.description, 19, font, textColor);
          children.push(
            new Paragraph({
              spacing: { after: 30 },
              children: descRuns.length > 0 ? descRuns : [new TextRun({ text: item.description, size: 19, font })],
            })
          );
        }
      });
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

export async function generateCoverLetterDocx(
  data: CoverLetterData,
  _design: any
): Promise<Buffer> {
  const children: any[] = [
    new Paragraph({
      children: [
        new TextRun({ text: data.senderName, bold: true, size: 28, font: 'Calibri' }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `${data.senderTitle} | ${data.senderEmail} | ${data.senderPhone}`,
          size: 18,
          color: '6B7280',
        }),
      ],
      spacing: { after: 300 },
    }),
    new Paragraph({
      children: [new TextRun({ text: data.date, size: 20 })],
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: data.recipientName, bold: true, size: 20 }),
        new TextRun({
          text: `\n${data.recipientTitle}\n${data.companyName}\n${data.companyAddress}`,
          size: 20,
        }),
      ],
      spacing: { after: 250 },
    }),
    new Paragraph({
      children: [new TextRun({ text: data.salutation, bold: true, size: 20 })],
      spacing: { after: 150 },
    }),
    new Paragraph({
      children: [new TextRun({ text: data.openingParagraph, size: 20 })],
      spacing: { after: 150 },
    }),
  ];

  (data.bodyParagraphs || []).forEach((bp) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: bp, size: 20 })],
        spacing: { after: 150 },
      })
    );
  });

  children.push(
    new Paragraph({
      children: [new TextRun({ text: data.closingParagraph, size: 20 })],
      spacing: { after: 250 },
    }),
    new Paragraph({
      children: [
        new TextRun({ text: data.signOff, size: 20 }),
        new TextRun({ text: `\n\n${data.senderName}`, bold: true, size: 22 }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

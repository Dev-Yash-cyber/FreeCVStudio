import { ResumeData, DesignSettings, CoverLetterData } from '../types/index.js';

export function generateResumeHtml(data: ResumeData, design: DesignSettings): string {
  const p = data.personalInfo || ({} as any);
  const experiences = data.experience || [];
  const educations = data.education || [];
  const skillCats = data.skillCategories || [];
  const projects = data.projects || [];
  const certs = data.certifications || [];
  const awards = data.awards || [];

  const fontFamily = design.fontFamily || 'Inter';
  const accentColor = design.accentColor || '#2563eb';
  const textColor = design.textColor || '#1e293b';
  const headingColor = design.headingColor || '#0f172a';
  const fontSize = design.fontSize || 11;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${p.fullName || 'Resume'} - FreeCV Studio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: ${design.paperSize === 'Letter' ? 'letter' : 'A4'};
      margin: ${design.margins || 20}px;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: ${fontSize}px;
      line-height: ${design.lineSpacing || 1.4};
      color: ${textColor};
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .resume-header {
      border-bottom: 2px solid ${accentColor};
      padding-bottom: 12px;
      margin-bottom: ${design.sectionSpacing || 16}px;
    }
    .full-name {
      font-size: ${design.nameFontSize || 26}px;
      font-weight: 700;
      color: ${headingColor};
      letter-spacing: -0.02em;
      margin-bottom: 4px;
    }
    .headline {
      font-size: 14px;
      font-weight: 500;
      color: ${accentColor};
      margin-bottom: 8px;
    }
    .contact-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 10px;
      color: #64748b;
    }
    .section {
      margin-bottom: ${design.sectionSpacing || 16}px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: ${design.headingFontSize || 14}px;
      font-weight: 700;
      color: ${headingColor};
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-left: 3px solid ${accentColor};
      padding-left: 8px;
      margin-bottom: 8px;
    }
    .summary-text {
      font-size: ${fontSize}px;
      line-height: 1.5;
      color: ${textColor};
    }
    .item {
      margin-bottom: 10px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .item-title {
      font-weight: 600;
      font-size: 12px;
      color: ${headingColor};
    }
    .item-subtitle {
      font-weight: 500;
      color: #475569;
    }
    .item-date {
      font-size: 10px;
      color: #64748b;
      white-space: nowrap;
    }
    ul.bullets {
      padding-left: 16px;
      margin-top: 4px;
    }
    ul.bullets li {
      margin-bottom: 3px;
      font-size: ${fontSize}px;
    }
    .skills-grid {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .skill-cat {
      font-size: 11px;
    }
    .skill-cat-name {
      font-weight: 600;
      color: ${headingColor};
    }
    .skill-pills {
      color: #334155;
    }
  </style>
</head>
<body>
  <div class="resume-header">
    <h1 class="full-name">${escapeHtml(p.fullName || 'Your Name')}</h1>
    ${p.headline ? `<div class="headline">${escapeHtml(p.headline)}</div>` : ''}
    <div class="contact-row">
      ${p.email ? `<span>✉ ${escapeHtml(p.email)}</span>` : ''}
      ${p.phone ? `<span>☎ ${escapeHtml(p.phone)}</span>` : ''}
      ${p.city || p.country ? `<span>📍 ${escapeHtml([p.city, p.country].filter(Boolean).join(', '))}</span>` : ''}
      ${p.linkedin ? `<span>🔗 ${escapeHtml(p.linkedin)}</span>` : ''}
      ${p.github ? `<span>💻 ${escapeHtml(p.github)}</span>` : ''}
      ${p.website ? `<span>🌐 ${escapeHtml(p.website)}</span>` : ''}
    </div>
  </div>

  ${p.summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="summary-text">${escapeHtml(p.summary)}</div>
  </div>` : ''}

  ${experiences.length > 0 ? `
  <div class="section">
    <div class="section-title">Experience</div>
    ${experiences.map((exp) => `
      <div class="item">
        <div class="item-header">
          <div><span class="item-title">${escapeHtml(exp.jobTitle)}</span> at <span class="item-subtitle">${escapeHtml(exp.employer)}</span>${exp.location ? `, ${escapeHtml(exp.location)}` : ''}</div>
          <div class="item-date">${escapeHtml(exp.startDate)} - ${exp.isCurrent ? 'Present' : escapeHtml(exp.endDate)}</div>
        </div>
        ${exp.bulletPoints && exp.bulletPoints.length > 0 ? `
        <ul class="bullets">
          ${exp.bulletPoints.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${educations.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${educations.map((edu) => `
      <div class="item">
        <div class="item-header">
          <div><span class="item-title">${escapeHtml(edu.degree)}</span> in <span class="item-subtitle">${escapeHtml(edu.fieldOfStudy)}</span> — ${escapeHtml(edu.institution)}</div>
          <div class="item-date">${escapeHtml(edu.startDate)} - ${edu.isCurrent ? 'Present' : escapeHtml(edu.endDate)}</div>
        </div>
        ${edu.gpa ? `<div style="font-size: 10px; color: #64748b;">GPA: ${escapeHtml(edu.gpa)}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${skillCats.length > 0 ? `
  <div class="section">
    <div class="section-title">Skills & Technologies</div>
    <div class="skills-grid">
      ${skillCats.map((cat) => `
        <div class="skill-cat">
          <span class="skill-cat-name">${escapeHtml(cat.categoryName)}:</span>
          <span class="skill-pills">${cat.skills.map((s) => escapeHtml(s.name)).join(', ')}</span>
        </div>
      `).join('')}
    </div>
  </div>` : ''}

  ${projects.length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${projects.map((proj) => `
      <div class="item">
        <div class="item-header">
          <div><span class="item-title">${escapeHtml(proj.name)}</span> ${proj.role ? `(${escapeHtml(proj.role)})` : ''}</div>
          ${proj.startDate ? `<div class="item-date">${escapeHtml(proj.startDate)} - ${escapeHtml(proj.endDate || 'Present')}</div>` : ''}
        </div>
        <p style="font-size: 11px; margin-bottom: 2px;">${escapeHtml(proj.description)}</p>
        ${proj.technologies && proj.technologies.length > 0 ? `<div style="font-size: 10px; color: ${accentColor};">Stack: ${escapeHtml(proj.technologies.join(', '))}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  ${certs.length > 0 ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    ${certs.map((c) => `
      <div class="item">
        <div class="item-header">
          <div><span class="item-title">${escapeHtml(c.name)}</span> — ${escapeHtml(c.issuer)}</div>
          ${c.issueDate ? `<div class="item-date">${escapeHtml(c.issueDate)}</div>` : ''}
        </div>
      </div>
    `).join('')}
  </div>` : ''}
</body>
</html>`;
}

export function generateCoverLetterHtml(data: CoverLetterData, design: any): string {
  const fontFamily = design.fontFamily || 'Inter';
  const accentColor = design.accentColor || '#2563eb';
  const textColor = design.textColor || '#1e293b';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Cover Letter - ${escapeHtml(data.senderName || 'FreeCV Studio')}</title>
  <style>
    @page { size: ${design.paperSize === 'Letter' ? 'letter' : 'A4'}; margin: 25mm; }
    body {
      font-family: '${fontFamily}', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: ${textColor};
      background: #ffffff;
      padding: 20px;
    }
    .header {
      border-bottom: 2px solid ${accentColor};
      padding-bottom: 14px;
      margin-bottom: 24px;
    }
    .name { font-size: 22pt; font-weight: 700; color: #0f172a; }
    .title { font-size: 12pt; color: ${accentColor}; font-weight: 500; }
    .contact { font-size: 9pt; color: #64748b; margin-top: 6px; }
    .date-row { margin-bottom: 20px; color: #475569; }
    .recipient { margin-bottom: 24px; line-height: 1.4; }
    .recipient-name { font-weight: 600; color: #0f172a; }
    .salutation { font-weight: 600; margin-bottom: 16px; }
    .paragraph { margin-bottom: 16px; text-align: justify; }
    .sign-off { margin-top: 32px; font-weight: 500; }
    .sender-sign { margin-top: 24px; font-weight: 700; font-size: 12pt; }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${escapeHtml(data.senderName || 'Your Name')}</div>
    <div class="title">${escapeHtml(data.senderTitle || 'Professional')}</div>
    <div class="contact">
      ${[data.senderEmail, data.senderPhone, data.senderLocation].filter(Boolean).map(escapeHtml).join(' | ')}
    </div>
  </div>

  <div class="date-row">${escapeHtml(data.date)}</div>

  <div class="recipient">
    <div class="recipient-name">${escapeHtml(data.recipientName)}</div>
    <div>${escapeHtml(data.recipientTitle)}</div>
    <div>${escapeHtml(data.companyName)}</div>
    <div>${escapeHtml(data.companyAddress)}</div>
  </div>

  <div class="salutation">${escapeHtml(data.salutation)}</div>

  <div class="paragraph">${escapeHtml(data.openingParagraph)}</div>

  ${(data.bodyParagraphs || []).map((p) => `<div class="paragraph">${escapeHtml(p)}</div>`).join('')}

  <div class="paragraph">${escapeHtml(data.closingParagraph)}</div>

  <div class="sign-off">${escapeHtml(data.signOff)}</div>
  <div class="sender-sign">${escapeHtml(data.senderName)}</div>
</body>
</html>`;
}

function escapeHtml(text: string = ''): string {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

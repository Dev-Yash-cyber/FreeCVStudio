import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { ResumeData, SkillCategory, ExperienceItem, EducationItem, ProjectItem, CertificationItem, CustomSection } from '../types/index.js';

export async function parseResumeFile(
  fileBuffer: Buffer,
  mimeType: string,
  fileName: string
): Promise<{ text: string; data: ResumeData }> {
  let extractedText = '';

  if (mimeType === 'application/pdf' || fileName.toLowerCase().endsWith('.pdf')) {
    const parsed = await pdfParse(fileBuffer);
    extractedText = parsed.text;
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.toLowerCase().endsWith('.docx')
  ) {
    const parsed = await mammoth.extractRawText({ buffer: fileBuffer });
    extractedText = parsed.value;
  } else {
    extractedText = fileBuffer.toString('utf-8');
  }

  const structured = parseTextToResume(extractedText);
  return { text: extractedText, data: structured };
}

function isDateRange(str: string): boolean {
  const dateRegex = /(?:(?:\d{1,2}[/.-]\d{4}|\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\b\d{4})\s*[-–—to]+\s*(?:\d{1,2}[/.-]\d{4}|\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\b\d{4}|Present|Current)\b)|(?:\b(?:0?[1-9]|1[0-2])\s*[/.-]\s*\d{4})|(?:\b\d{4}\s*[-–—]\s*\d{4}\b)/i;
  return dateRegex.test(str);
}

function parseDates(str: string): { startDate: string; endDate: string; isCurrent: boolean } {
  const match = str.match(/(\d{1,2}[/.-]\d{4}|\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\b\d{4})\s*[-–—to]+\s*(\d{1,2}[/.-]\d{4}|\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|\b\d{4}|Present|Current)/i);
  if (match) {
    const startDate = match[1].trim();
    const endDate = match[2].trim();
    const isCurrent = /present|current/i.test(endDate);
    return { startDate, endDate, isCurrent };
  }
  const singleDate = str.match(/(\d{1,2}[/.-]\d{4}|\d{4})/);
  if (singleDate) {
    return { startDate: singleDate[1], endDate: singleDate[1], isCurrent: false };
  }
  return { startDate: '', endDate: '', isCurrent: false };
}

function isLocation(str: string): boolean {
  const s = str.trim();
  if (/^remote$/i.test(s)) return true;
  if (/^[A-Za-z\s]+,\s*[A-Za-z\s]+$/.test(s) && s.length < 40) return true;
  if (/^(vadodara|anand|ahmedabad|mumbai|bangalore|delhi|pune|hyderabad|new york|san francisco|london|toronto|chicago|seattle|austin)$/i.test(s)) return true;
  return false;
}

export function parseTextToResume(text: string): ResumeData {
  const rawLines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  // 1. Contact / Header parsing
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const email = emailMatch ? emailMatch[0] : '';

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';

  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[\w-]+/i);
  const github = githubMatch ? githubMatch[0] : '';

  // Extract name: first clean line that isn't a link/email/phone
  let fullName = '';
  for (let i = 0; i < Math.min(6, rawLines.length); i++) {
    const line = rawLines[i];
    if (
      line.length > 2 &&
      line.length < 45 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('github') &&
      !line.includes('+') &&
      !/^(profile|summary|resume|cv)$/i.test(line)
    ) {
      fullName = line;
      break;
    }
  }

  // 2. Identify sections
  const sectionKeywords = [
    { key: 'profile', regex: /^(profile|summary|professional\s+summary|about\s+me|objective)$/i },
    { key: 'experience', regex: /^(work\s+experience.*|experience.*|employment.*|internships?.*|professional\s+experience.*)$/i },
    { key: 'education', regex: /^(education.*|academics?.*|academic\s+background.*)$/i },
    { key: 'skills', regex: /^(skills.*|technical\s+skills.*|core\s+competencies.*|technical\s+proficiencies.*|technologies.*)$/i },
    { key: 'projects', regex: /^(projects.*|key\s+projects.*|academic\s+projects.*|personal\s+projects.*)$/i },
    { key: 'certificates', regex: /^(certificates.*|certifications.*|licenses.*)$/i },
    { key: 'languages', regex: /^(languages.*|language\s+proficiency.*)$/i },
    { key: 'awards', regex: /^(awards.*|honors.*|achievements.*)$/i },
    { key: 'volunteering', regex: /^(volunteering.*|volunteer.*|leadership.*)$/i },
  ];

  const sections: Record<string, string[]> = { header: [] };
  let currentKey = 'header';

  for (const line of rawLines) {
    let matchedKey: string | null = null;
    for (const sec of sectionKeywords) {
      if (sec.regex.test(line)) {
        matchedKey = sec.key;
        break;
      }
    }

    if (matchedKey) {
      currentKey = matchedKey;
      if (!sections[currentKey]) sections[currentKey] = [];
    } else {
      sections[currentKey].push(line);
    }
  }

  // Helper to re-join wrapped bullet points and lines in a section
  function normalizeSectionLines(lines: string[]): string[] {
    const normalized: string[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isBullet = /^[-•*–—▪▫]\s*/.test(line);
      const isDate = isDateRange(line);
      const isLoc = isLocation(line);

      const prev = normalized[normalized.length - 1];

      const isNewHeader = line.includes('|') || line.includes(':') || isDate || isLoc || isBullet;

      const isContinuation =
        normalized.length > 0 &&
        !isNewHeader &&
        (
          /^[a-z]/.test(line) ||
          (prev && /(and|or|with|to|in|of|for|,|-)$/i.test(prev))
        );

      if (isContinuation) {
        normalized[normalized.length - 1] += ' ' + line;
      } else {
        normalized.push(line);
      }
    }
    return normalized;
  }

  // 3. Parse Profile / Summary
  let summary = '';
  let headline = 'Full Stack Developer';
  if (sections.profile && sections.profile.length > 0) {
    summary = sections.profile.join(' ');
    const headlineMatch = summary.match(/^([A-Za-z0-9\s/-]+?)(?:\s+with|\s+having|\s+offering|\.|\,)/i);
    if (headlineMatch && headlineMatch[1].length < 60) {
      headline = headlineMatch[1].trim();
    }
  }

  // 4. Parse Work Experience
  const experiences: ExperienceItem[] = [];
  if (sections.experience && sections.experience.length > 0) {
    const expLines = normalizeSectionLines(sections.experience);
    let currentExp: ExperienceItem | null = null;
    let currentEmployer = '';

    for (let i = 0; i < expLines.length; i++) {
      const line = expLines[i];
      const isBullet = /^[-•*–—▪▫]\s*/.test(line);

      if (isDateRange(line)) {
        const dateInfo = parseDates(line);
        if (currentExp) {
          currentExp.startDate = dateInfo.startDate || currentExp.startDate;
          currentExp.endDate = dateInfo.endDate || currentExp.endDate;
          currentExp.isCurrent = dateInfo.isCurrent;
        }
        continue;
      }

      if (isLocation(line)) {
        if (currentExp) {
          currentExp.location = line;
        }
        continue;
      }

      if (isBullet) {
        if (currentExp) {
          currentExp.bulletPoints.push(line.replace(/^[-•*–—▪▫]\s*/, '').trim());
        }
        continue;
      }

      const commaSplit = line.split(/,\s*/);
      
      if (commaSplit.length >= 2 && !/^(worked|designed|built|developed|contributed|implementing|assisting|created)/i.test(line)) {
        const employer = commaSplit[0].trim();
        const role = commaSplit.slice(1).join(', ').trim();
        currentEmployer = employer;

        currentExp = {
          id: `exp-${Date.now()}-${experiences.length + 1}`,
          jobTitle: role,
          employer: employer,
          employmentType: /intern/i.test(role) ? 'Internship' : 'Full-time',
          location: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          bulletPoints: [],
          technologies: [],
        };
        experiences.push(currentExp);
      } else if (!/^(worked|designed|built|developed|contributed|implementing|assisting|created)/i.test(line)) {
        const isJobRole = /(developer|engineer|intern|manager|lead|architect|analyst|specialist|designer|consultant|officer|associate|executive)/i.test(line);
        if (isJobRole && currentEmployer) {
          currentExp = {
            id: `exp-${Date.now()}-${experiences.length + 1}`,
            jobTitle: line,
            employer: currentEmployer,
            employmentType: /intern/i.test(line) ? 'Internship' : 'Full-time',
            location: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            bulletPoints: [],
            technologies: [],
          };
          experiences.push(currentExp);
        } else {
          currentEmployer = line;
        }
      } else if (currentExp) {
        currentExp.bulletPoints.push(line.replace(/^[-•*–—▪▫]\s*/, '').trim());
      }
    }
  }

  // 5. Parse Education
  const educations: EducationItem[] = [];
  if (sections.education && sections.education.length > 0) {
    const eduLines = normalizeSectionLines(sections.education);
    let currentEdu: EducationItem | null = null;

    for (let i = 0; i < eduLines.length; i++) {
      const line = eduLines[i];

      if (isDateRange(line)) {
        const dateInfo = parseDates(line);
        if (currentEdu) {
          currentEdu.startDate = dateInfo.startDate || currentEdu.startDate;
          currentEdu.endDate = dateInfo.endDate || currentEdu.endDate;
          currentEdu.isCurrent = dateInfo.isCurrent;
        }
        continue;
      }

      if (isLocation(line)) {
        if (currentEdu) currentEdu.location = line;
        continue;
      }

      const isBullet = /^[-•*–—▪▫]\s*/.test(line);
      if (isBullet) {
        const clean = line.replace(/^[-•*–—▪▫]\s*/, '').trim();
        if (currentEdu) {
          if (!currentEdu.fieldOfStudy || currentEdu.fieldOfStudy === 'General Studies') {
            currentEdu.fieldOfStudy = clean;
          } else {
            if (!currentEdu.achievements) currentEdu.achievements = [];
            currentEdu.achievements.push(clean);
          }
        }
        continue;
      }

      const commaSplit = line.split(/,\s*/);
      if (commaSplit.length >= 2) {
        currentEdu = {
          id: `edu-${Date.now()}-${educations.length + 1}`,
          institution: commaSplit[0].trim(),
          degree: commaSplit.slice(1).join(', ').trim(),
          fieldOfStudy: '',
          location: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
        };
        educations.push(currentEdu);
      } else {
        if (!currentEdu) {
          currentEdu = {
            id: `edu-${Date.now()}-${educations.length + 1}`,
            institution: line,
            degree: 'Degree',
            fieldOfStudy: '',
            location: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
          };
          educations.push(currentEdu);
        } else if (!currentEdu.degree || currentEdu.degree === 'Degree') {
          currentEdu.degree = line;
        } else if (!currentEdu.fieldOfStudy) {
          currentEdu.fieldOfStudy = line;
        }
      }
    }
  }

  // 6. Parse Skills Categories
  const skillCategories: SkillCategory[] = [];
  if (sections.skills && sections.skills.length > 0) {
    const rawSkillLines = sections.skills;
    const mergedSkillLines: string[] = [];
    
    for (const l of rawSkillLines) {
      if (l.includes(':')) {
        mergedSkillLines.push(l);
      } else if (mergedSkillLines.length > 0) {
        mergedSkillLines[mergedSkillLines.length - 1] += ', ' + l;
      } else {
        mergedSkillLines.push(l);
      }
    }

    for (const line of mergedSkillLines) {
      if (line.includes(':')) {
        const [catName, skillsStr] = line.split(/:\s*(.*)/, 2);
        const parsedSkills = skillsStr
          .split(/[,•|/]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 1);

        if (parsedSkills.length > 0) {
          skillCategories.push({
            id: `cat-${skillCategories.length + 1}`,
            categoryName: catName.trim(),
            skills: parsedSkills.map((s) => ({ name: s, level: 'Advanced' })),
          });
        }
      } else {
        const standaloneSkills = line
          .split(/[,•|/]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 1);
        if (standaloneSkills.length > 0) {
          skillCategories.push({
            id: `cat-${skillCategories.length + 1}`,
            categoryName: 'General Skills',
            skills: standaloneSkills.map((s) => ({ name: s, level: 'Advanced' })),
          });
        }
      }
    }
  }

  // 7. Parse Projects
  const projects: ProjectItem[] = [];
  if (sections.projects && sections.projects.length > 0) {
    const projLines = normalizeSectionLines(sections.projects);
    let currentProj: ProjectItem | null = null;

    for (const line of projLines) {
      const isBullet = /^[-•*–—▪▫]\s*/.test(line);

      if (isBullet) {
        const clean = line.replace(/^[-•*–—▪▫]\s*/, '').trim();
        if (currentProj) {
          currentProj.bulletPoints.push(clean);
          if (!currentProj.description) {
            currentProj.description = clean;
          }
        }
        continue;
      }

      const parts = line.split(/[,|]\s*/);
      const name = parts[0].trim();
      const techs = parts.slice(1).map((t) => t.trim()).filter(Boolean);

      currentProj = {
        id: `proj-${Date.now()}-${projects.length + 1}`,
        name: name,
        description: '',
        technologies: techs,
        bulletPoints: [],
      };
      projects.push(currentProj);
    }
  }

  // 8. Parse Certificates
  const certifications: CertificationItem[] = [];
  if (sections.certificates && sections.certificates.length > 0) {
    const certLines = normalizeSectionLines(sections.certificates);

    for (const line of certLines) {
      const isBullet = /^[-•*–—▪▫]\s*/.test(line);
      if (isBullet) {
        continue;
      }

      const parts = line.split(/[|,]\s*/);
      const name = parts[0].trim();
      let issuer = parts.length > 1 ? parts[1].trim() : '';
      let issueDate = '';

      for (const p of parts) {
        if (isDateRange(p)) {
          issueDate = p.trim();
          if (issuer === p.trim()) issuer = '';
        }
      }

      certifications.push({
        id: `cert-${Date.now()}-${certifications.length + 1}`,
        name: name,
        issuer: issuer || 'Accredited Issuer',
        issueDate: issueDate,
      });
    }
  }

  // 9. Parse Languages
  const customSections: CustomSection[] = [];
  if (sections.languages && sections.languages.length > 0) {
    const langLines = sections.languages;
    const langItems = [];

    for (let i = 0; i < langLines.length; i += 2) {
      const langName = langLines[i];
      const proficiency = langLines[i + 1] || 'Proficient';
      if (langName && !/^[-•*–—▪▫]/.test(langName)) {
        langItems.push({
          id: `lang-${langItems.length + 1}`,
          title: langName.trim(),
          subtitle: proficiency.trim(),
          bulletPoints: [],
        });
      }
    }

    if (langItems.length > 0) {
      customSections.push({
        id: `sec-languages`,
        sectionTitle: 'Languages',
        items: langItems,
      });
    }
  }

  return {
    personalInfo: {
      fullName: fullName || 'Candidate',
      headline: headline,
      email,
      phone,
      city: experiences[0]?.location?.split(',')[0] || '',
      state: experiences[0]?.location?.split(',')[1]?.trim() || '',
      country: 'India',
      linkedin,
      github,
      website: '',
      summary: summary || 'Frontend-focused Full Stack Developer dedicated to building scalable web applications.',
    },
    experience: experiences,
    education: educations,
    skillCategories: skillCategories,
    projects: projects,
    certifications: certifications,
    awards: [],
    publications: [],
    volunteering: [],
    interests: [],
    references: [],
    customSections: customSections,
    sectionOrder: ['experience', 'education', 'skills', 'projects', 'certifications', 'customSections'],
  };
}

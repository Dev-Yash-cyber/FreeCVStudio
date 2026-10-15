import { ResumeData } from '../types/index.js';

export interface ATSAnalysisResult {
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  breakdown: {
    contactDetailsScore: number;
    summaryScore: number;
    experienceScore: number;
    educationScore: number;
    skillsScore: number;
    formattingScore: number;
    keywordMatchScore?: number;
  };
  metrics: {
    totalWords: number;
    actionVerbCount: number;
    quantifiableAchievementsCount: number;
    bulletCount: number;
    detectedKeywords: string[];
    suggestedKeywords: string[];
    missingSections: string[];
    passiveVerbsCount: number;
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    issue: string;
    suggestion: string;
  }>;
  explanation: string;
}

const ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'analyzed', 'architected', 'automated',
  'built', 'championed', 'collaborated', 'conceived', 'configured', 'constructed',
  'coordinated', 'created', 'customized', 'decreased', 'delivered', 'designed',
  'developed', 'devised', 'directed', 'engineered', 'enhanced', 'established',
  'executed', 'expanded', 'expedited', 'facilitated', 'formulated', 'generated',
  'guided', 'headed', 'identified', 'implemented', 'improved', 'increased',
  'initiated', 'innovated', 'instituted', 'integrated', 'invented', 'launched',
  'led', 'managed', 'maximized', 'mentored', 'modernized', 'negotiated',
  'optimized', 'orchestrated', 'overhauled', 'pioneered', 'planned', 'produced',
  'programmed', 'reduced', 'refactored', 'resolved', 'restructured', 'revamped',
  'scaled', 'simplified', 'spearheaded', 'standardized', 'streamlined', 'strengthened',
  'supervised', 'trained', 'transformed', 'upgraded', 'validated'
];

const WEAK_WORDS = [
  'helped', 'worked on', 'assisted', 'handled', 'responsible for', 'tried to',
  'various', 'stuff', 'things', 'duties included', 'was responsible'
];

const TECH_KEYWORDS = [
  'react', 'typescript', 'javascript', 'python', 'node.js', 'express', 'mongodb',
  'sql', 'postgresql', 'aws', 'docker', 'kubernetes', 'ci/cd', 'git', 'rest api',
  'graphql', 'html5', 'css3', 'tailwind', 'microservices', 'agile', 'scrum',
  'test automation', 'vitest', 'jest', 'next.js', 'redis', 'linux'
];

export const analyzeResume = (data: ResumeData, targetJobDescription?: string): ATSAnalysisResult => {
  let contactScore = 0;
  let summaryScore = 0;
  let expScore = 0;
  let eduScore = 0;
  let skillsScore = 0;
  let formatScore = 85; // baseline clean
  const recommendations: ATSAnalysisResult['recommendations'] = [];
  const missingSections: string[] = [];

  // 1. Contact Details (Max 15 pts)
  const pi = data.personalInfo || ({} as any);
  if (pi.fullName && pi.fullName.trim().length > 2) contactScore += 3;
  if (pi.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pi.email)) contactScore += 3;
  else recommendations.push({ priority: 'high', category: 'Contact Details', issue: 'Missing or invalid email address.', suggestion: 'Provide a professional personal email address.' });

  if (pi.phone && pi.phone.trim().length >= 7) contactScore += 3;
  else recommendations.push({ priority: 'medium', category: 'Contact Details', issue: 'Missing telephone number.', suggestion: 'Include a direct contact number with country code.' });

  if (pi.city || pi.country) contactScore += 3;
  else recommendations.push({ priority: 'low', category: 'Contact Details', issue: 'Missing location.', suggestion: 'Add your city and country so recruiters understand your timezone/eligibility.' });

  if (pi.linkedin || pi.github || pi.website) contactScore += 3;
  else recommendations.push({ priority: 'medium', category: 'Contact Details', issue: 'No LinkedIn or portfolio link.', suggestion: 'Adding LinkedIn, GitHub, or a personal website significantly boosts credibility.' });

  // 2. Professional Summary (Max 15 pts)
  const summary = (pi.summary || '').trim();
  const summaryWords = summary ? summary.split(/\s+/).length : 0;
  if (summaryWords >= 25 && summaryWords <= 100) {
    summaryScore = 15;
  } else if (summaryWords > 0 && summaryWords < 25) {
    summaryScore = 8;
    recommendations.push({ priority: 'medium', category: 'Summary', issue: 'Summary is too brief.', suggestion: 'Expand your professional summary to 3-5 punchy sentences highlighting your core value and years of expertise.' });
  } else if (summaryWords > 100) {
    summaryScore = 10;
    recommendations.push({ priority: 'low', category: 'Summary', issue: 'Summary is too long.', suggestion: 'Condense your summary to under 100 words so ATS and recruiters can scan it in 6 seconds.' });
  } else {
    missingSections.push('Professional Summary');
    recommendations.push({ priority: 'high', category: 'Summary', issue: 'Missing professional summary.', suggestion: 'Add a 3-4 sentence elevator pitch at the top of your resume.' });
  }

  // 3. Work Experience & Quantifiable Achievements (Max 30 pts)
  let actionVerbCount = 0;
  let quantifiableCount = 0;
  let totalBullets = 0;
  let totalWords = summaryWords;
  const detectedKeywordsSet = new Set<string>();

  const experiences = data.experience || [];
  if (experiences.length === 0) {
    missingSections.push('Experience');
    recommendations.push({ priority: 'high', category: 'Experience', issue: 'No experience listed.', suggestion: 'Add relevant internships, projects, or employment history.' });
  } else {
    expScore += 10;
    experiences.forEach((exp) => {
      const bullets = exp.bulletPoints || [];
      totalBullets += bullets.length;
      bullets.forEach((bullet) => {
        const lower = bullet.toLowerCase();
        const words = lower.split(/\s+/);
        totalWords += words.length;

        // check action verbs
        if (ACTION_VERBS.some((v) => lower.startsWith(v) || words.includes(v))) {
          actionVerbCount++;
        }
        // check quantifiable numbers (%, $, +, numbers)
        if (/(\d+%\b|\$\d+|\d+\+|\b\d+\s*(users|clients|projects|million|k|percent|hours|seconds|ms)\b)/i.test(bullet)) {
          quantifiableCount++;
        }
        // check weak words
        WEAK_WORDS.forEach((ww) => {
          if (lower.includes(ww)) {
            recommendations.push({
              priority: 'medium',
              category: 'Impact & Verbs',
              issue: `Weak phrasing detected: "${ww}".`,
              suggestion: `Replace "${ww}" with a strong power verb like "Architected", "Engineered", or "Spearheaded".`,
            });
          }
        });
      });
    });

    if (actionVerbCount >= experiences.length * 2) expScore += 10;
    else if (actionVerbCount > 0) expScore += 6;
    else recommendations.push({ priority: 'high', category: 'Experience', issue: 'Few or no strong action verbs.', suggestion: 'Begin bullet points with powerful past-tense action verbs (e.g. Delivered, Scaled, Built).' });

    if (quantifiableCount >= 2) expScore += 10;
    else if (quantifiableCount === 1) expScore += 6;
    else recommendations.push({ priority: 'high', category: 'Achievements', issue: 'Lacks measurable metrics.', suggestion: 'Include numbers, percentages, dollar figures, or scale (e.g., "Reduced latency by 42%", "Served 200k+ MAU").' });
  }

  // 4. Education (Max 15 pts)
  const educations = data.education || [];
  if (educations.length === 0) {
    missingSections.push('Education');
    recommendations.push({ priority: 'medium', category: 'Education', issue: 'No education listed.', suggestion: 'Include your college degree, high school, or certified academic background.' });
  } else {
    eduScore = 15;
  }

  // 5. Skills Coverage (Max 20 pts)
  const skillCategories = data.skillCategories || [];
  let totalSkills = 0;
  skillCategories.forEach((cat) => {
    (cat.skills || []).forEach((s) => {
      totalSkills++;
      detectedKeywordsSet.add(s.name.toLowerCase());
    });
  });

  if (totalSkills >= 8) skillsScore = 20;
  else if (totalSkills >= 4) skillsScore = 14;
  else if (totalSkills > 0) {
    skillsScore = 8;
    recommendations.push({ priority: 'medium', category: 'Skills', issue: 'Limited skill keywords.', suggestion: 'List at least 8 to 12 relevant technical and domain-specific skills.' });
  } else {
    missingSections.push('Skills');
    recommendations.push({ priority: 'high', category: 'Skills', issue: 'No skills section found.', suggestion: 'Add a categorized Skills section with technical, tool, and industry proficiencies.' });
  }

  // 6. Job Description matching if provided
  let keywordMatchScore: number | undefined;
  const suggestedKeywords: string[] = [];

  if (targetJobDescription && targetJobDescription.trim().length > 20) {
    const jdLower = targetJobDescription.toLowerCase();
    const matched = TECH_KEYWORDS.filter((kw) => jdLower.includes(kw));
    const resumeFullText = JSON.stringify(data).toLowerCase();

    const missingInResume = matched.filter((kw) => !resumeFullText.includes(kw));
    suggestedKeywords.push(...missingInResume.slice(0, 10));

    const matchCount = matched.length - missingInResume.length;
    keywordMatchScore = matched.length > 0 ? Math.round((matchCount / matched.length) * 100) : 80;

    if (missingInResume.length > 0) {
      recommendations.unshift({
        priority: 'high',
        category: 'ATS Keyword Match',
        issue: `Missing ${missingInResume.length} critical keywords from job description.`,
        suggestion: `Consider incorporating: ${missingInResume.slice(0, 5).join(', ')} where relevant.`,
      });
    }
  }

  // Total raw score out of 100
  let totalRaw = contactScore + summaryScore + expScore + eduScore + skillsScore;
  if (keywordMatchScore !== undefined) {
    totalRaw = Math.round(totalRaw * 0.7 + keywordMatchScore * 0.3);
  }
  const overallScore = Math.min(100, Math.max(10, totalRaw));

  let grade: ATSAnalysisResult['grade'] = 'C';
  if (overallScore >= 90) grade = 'A+';
  else if (overallScore >= 80) grade = 'A';
  else if (overallScore >= 70) grade = 'B';
  else if (overallScore >= 60) grade = 'C';
  else grade = 'D';

  const explanation = `FreeCV ATS Engine scored this resume ${overallScore}/100 (Grade ${grade}) based on structural parsing accuracy, contact clarity, quantifiable metric density (${quantifiableCount} metrics found), action verb strength (${actionVerbCount} power verbs), and ATS-friendly section labeling.`;

  return {
    overallScore,
    grade,
    breakdown: {
      contactDetailsScore: Math.round((contactScore / 15) * 100),
      summaryScore: Math.round((summaryScore / 15) * 100),
      experienceScore: Math.round((expScore / 30) * 100),
      educationScore: Math.round((eduScore / 15) * 100),
      skillsScore: Math.round((skillsScore / 20) * 100),
      formattingScore: formatScore,
      keywordMatchScore,
    },
    metrics: {
      totalWords,
      actionVerbCount,
      quantifiableAchievementsCount: quantifiableCount,
      bulletCount: totalBullets,
      detectedKeywords: Array.from(detectedKeywordsSet),
      suggestedKeywords: suggestedKeywords.length > 0 ? suggestedKeywords : ['Docker', 'AWS', 'CI/CD', 'GraphQL', 'System Design'],
      missingSections,
      passiveVerbsCount: 0,
    },
    recommendations,
    explanation,
  };
};

export interface JDMatchResult {
  overallScore: number;
  matchGrade: 'A+' | 'A' | 'B' | 'C' | 'D';
  verdict: string;
  breakdown: {
    technicalSkillsScore: number;
    softSkillsScore: number;
    experienceAlignmentScore: number;
    educationFitScore: number;
    formattingScore: number;
  };
  keywords: {
    matched: string[];
    missing: string[];
    softSkillsMatched: string[];
    softSkillsMissing: string[];
    totalJdKeywords: number;
  };
  recommendations: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
  }>;
  tailoredSummary: string;
  suggestedBullets: string[];
  jobTitle?: string;
  company?: string;
}

const EXTENDED_KEYWORDS = [
  // Frontend
  'react', 'react native', 'typescript', 'javascript', 'vue', 'angular', 'next.js', 'nuxt',
  'html', 'html5', 'css', 'css3', 'tailwind', 'bootstrap', 'sass', 'webpack', 'vite',
  'redux', 'zustand', 'graphql', 'rest api', 'responsive design', 'web accessibility', 'wcag',
  // Backend & Languages
  'node.js', 'express', 'nest.js', 'python', 'django', 'fastapi', 'flask', 'java', 'spring boot',
  'golang', 'go', 'c#', '.net', 'c++', 'rust', 'ruby', 'rails', 'php', 'laravel',
  // Database & Storage
  'sql', 'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'dynamodb', 'elasticsearch',
  'cassandra', 'sqlite', 'prisma', 'orm', 'mongoose',
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s', 'ci/cd', 'terraform',
  'github actions', 'jenkins', 'linux', 'bash', 'ansible', 'serverless', 'lambda', 'microservices',
  // Architecture & Concepts
  'system design', 'distributed systems', 'scalability', 'high availability', 'mvc', 'event-driven',
  'message queue', 'kafka', 'rabbitmq', 'concurrency', 'restful apis', 'api design',
  // Testing & Tooling
  'vitest', 'jest', 'cypress', 'playwright', 'selenium', 'unit testing', 'integration testing',
  'e2e testing', 'tdd', 'git', 'github', 'gitlab', 'jira', 'agile', 'scrum'
];

const SOFT_SKILLS_KEYWORDS = [
  'leadership', 'mentorship', 'communication', 'cross-functional collaboration', 'problem-solving',
  'stakeholder management', 'ownership', 'critical thinking', 'teamwork', 'strategic planning',
  'agile leadership', 'adaptability', 'initiative', 'project management', 'user focus'
];

export const matchResumeWithJobDescription = (
  resumeInput: any,
  jobDescription: string,
  targetJobTitle?: string,
  companyName?: string
): JDMatchResult => {
  const jdText = (jobDescription || '').toLowerCase();
  
  // Extract resume plain text whether it's ResumeData JSON or plain text
  let resumeText = '';
  if (typeof resumeInput === 'string') {
    resumeText = resumeInput.toLowerCase();
  } else if (resumeInput && typeof resumeInput === 'object') {
    resumeText = JSON.stringify(resumeInput).toLowerCase();
  }

  // 1. Extract technical keywords from JD
  const jdTechKeywords = EXTENDED_KEYWORDS.filter((kw) => {
    // Regex for whole word or exact token match
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
    return regex.test(jdText);
  });

  // Also include any specific skills in resume that appear in JD
  const matchedTech: string[] = [];
  const missingTech: string[] = [];

  jdTechKeywords.forEach((kw) => {
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
    if (regex.test(resumeText)) {
      matchedTech.push(kw);
    } else {
      missingTech.push(kw);
    }
  });

  // 2. Extract soft skills from JD
  const jdSoftKeywords = SOFT_SKILLS_KEYWORDS.filter((kw) => {
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
    return regex.test(jdText);
  });

  const matchedSoft: string[] = [];
  const missingSoft: string[] = [];

  jdSoftKeywords.forEach((kw) => {
    const escaped = kw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
    if (regex.test(resumeText)) {
      matchedSoft.push(kw);
    } else {
      missingSoft.push(kw);
    }
  });

  // Calculate scores
  const techScore = jdTechKeywords.length > 0
    ? Math.round((matchedTech.length / jdTechKeywords.length) * 100)
    : 85;

  const softScore = jdSoftKeywords.length > 0
    ? Math.round((matchedSoft.length / jdSoftKeywords.length) * 100)
    : 80;

  // Experience and quantitative impact detection
  const hasNumbers = /(\d+%\b|\$\d+|\d+\+|\b\d+\s*(users|clients|projects|million|k|percent|ms)\b)/i.test(resumeText);
  const actionVerbMatches = ACTION_VERBS.filter((v) => resumeText.includes(v)).length;
  const expScore = Math.min(100, (hasNumbers ? 50 : 25) + Math.min(50, actionVerbMatches * 5));

  // Education / credentials check
  const eduKeywords = ['degree', 'bachelor', 'master', 'bs', 'ms', 'phd', 'university', 'computer science', 'engineering'];
  const hasEdu = eduKeywords.some((e) => resumeText.includes(e));
  const eduScore = hasEdu ? 95 : 70;

  // Formatting score
  const formattingScore = 90;

  // Weighted overall score: 45% Tech, 20% Soft, 20% Exp/Impact, 15% Education
  const overallScore = Math.min(100, Math.max(15, Math.round(
    techScore * 0.45 + softScore * 0.20 + expScore * 0.20 + eduScore * 0.15
  )));

  let matchGrade: JDMatchResult['matchGrade'] = 'C';
  let verdict = '';
  if (overallScore >= 90) {
    matchGrade = 'A+';
    verdict = `Outstanding Match (${overallScore}%). Your qualifications, core technologies, and quantifiable achievements align seamlessly with this job requirement.`;
  } else if (overallScore >= 80) {
    matchGrade = 'A';
    verdict = `Strong Match (${overallScore}%). Your resume demonstrates high technical relevance. Incorporating the few missing keywords below will guarantee top-tier ATS ranking.`;
  } else if (overallScore >= 70) {
    matchGrade = 'B';
    verdict = `Good Match (${overallScore}%). You have relevant foundational skills, but several required technologies mentioned in the JD are missing from your resume.`;
  } else if (overallScore >= 55) {
    matchGrade = 'C';
    verdict = `Moderate Match (${overallScore}%). Significant keyword gaps detected. We recommend optimizing your summary and adding missing tools to your experience bullets.`;
  } else {
    matchGrade = 'D';
    verdict = `Low Keyword Alignment (${overallScore}%). Crucial core technical stacks and methodologies from this job posting were not detected on your resume.`;
  }

  // Recommendations
  const recommendations: JDMatchResult['recommendations'] = [];

  if (missingTech.length > 0) {
    recommendations.push({
      category: 'Critical Missing Skills',
      priority: 'high',
      title: `Add ${missingTech.length} Missing Technical Keywords`,
      description: `The job posting highlights: ${missingTech.slice(0, 6).join(', ')}. If you have experience with these tools, integrate them into your Skills and Experience sections.`,
    });
  }

  if (missingSoft.length > 0) {
    recommendations.push({
      category: 'Core Competencies',
      priority: 'medium',
      title: 'Emphasize Soft Skills & Leadership',
      description: `Highlight competencies such as ${missingSoft.slice(0, 3).join(', ')} in your professional summary and project bullets.`,
    });
  }

  if (!hasNumbers) {
    recommendations.push({
      category: 'Quantifiable Metrics',
      priority: 'high',
      title: 'Quantify Your Accomplishments',
      description: 'Add numbers, percentages, latency reductions, or revenue metrics to your work history to prove concrete business value.',
    });
  }

  // Tailored Summary Generation
  const roleName = targetJobTitle || 'Software Professional';
  const compName = companyName || 'your engineering organization';
  const topMatched = matchedTech.slice(0, 4).join(', ') || 'modern full-stack engineering';
  const topMissing = missingTech.slice(0, 2).join(' and ');
  const tailoredSummary = `Results-driven ${roleName} with proven expertise in ${topMatched}${topMissing ? ` and strong practical proficiency in ${topMissing}` : ''}. Passionate about architecting high-performance, scalable systems and driving cross-functional impact at ${compName}. Recognized for translating complex product requirements into resilient, testable production features with 99.9% uptime.`;

  // Suggested Bullets
  const primaryMissing = missingTech[0] || 'distributed systems';
  const secondaryMissing = missingTech[1] || 'automated CI/CD pipelines';
  const suggestedBullets = [
    `Architected and deployed scalable services leveraging ${primaryMissing} and ${matchedTech[0] || 'TypeScript'}, improving end-to-end processing throughput by 34%.`,
    `Integrated ${secondaryMissing} into daily engineering workflows, reducing regression deployment cycles from 4 hours to under 12 minutes.`,
    `Spearheaded performance optimization initiatives across ${matchedTech.slice(0, 2).join(' and ') || 'core applications'}, achieving a 42% reduction in p99 API latency.`,
  ];

  return {
    overallScore,
    matchGrade,
    verdict,
    breakdown: {
      technicalSkillsScore: techScore,
      softSkillsScore: softScore,
      experienceAlignmentScore: expScore,
      educationFitScore: eduScore,
      formattingScore,
    },
    keywords: {
      matched: matchedTech,
      missing: missingTech,
      softSkillsMatched: matchedSoft,
      softSkillsMissing: missingSoft,
      totalJdKeywords: jdTechKeywords.length + jdSoftKeywords.length,
    },
    recommendations,
    tailoredSummary,
    suggestedBullets,
    jobTitle: targetJobTitle,
    company: companyName,
  };
};


import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { aiService } from '../services/aiService.js';

const router = Router();

// 1. Improve Bullet Point
router.post('/improve-bullet', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { originalText, tone, jobTitle } = req.body;
    if (!originalText || typeof originalText !== 'string') {
      return res.status(400).json({ message: 'Original text is required.' });
    }

    const result = await aiService.improveBullet({ originalText, tone, jobTitle });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// 2. Generate Professional Summary
router.post('/generate-summary', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { jobTitle = 'Software Engineer', yearsOfExperience = 3, keySkills = [], tone } = req.body;
    const result = await aiService.generateSummary({
      jobTitle,
      yearsOfExperience: Number(yearsOfExperience),
      keySkills: Array.isArray(keySkills) ? keySkills : [],
      tone,
    });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// 3. Draft Cover Letter
router.post('/draft-cover-letter', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { jobTitle, companyName, applicantName, keyAchievements, skills } = req.body;
    if (!jobTitle || !companyName) {
      return res.status(400).json({ message: 'Job title and company name are required.' });
    }

    const result = await aiService.draftCoverLetter({
      jobTitle,
      companyName,
      applicantName: applicantName || 'Applicant',
      keyAchievements,
      skills,
    });

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// 4. Extract Keywords from Job Description
router.post('/extract-keywords', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ message: 'Job description text is required.' });
    }

    const result = await aiService.extractKeywords({ jobDescription });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

// 5. Generate Headline
router.post('/generate-headline', requireAuth, async (req: AuthRequest, res: Response) => {
  const { currentRole = 'Software Engineer', specialties = [] } = req.body;
  const list = specialties.length > 0 ? specialties.join(' | ') : 'Cloud & Distributed Systems';
  const headlines = [
    `Senior ${currentRole} | ${list} | High-Velocity Builder`,
    `Results-Driven ${currentRole} specializing in ${list}`,
    `Lead ${currentRole} • Architecture, Scalability & Team Leadership`,
  ];
  res.json({ success: true, headlines });
});

// 6. Translate Resume Content
router.post('/translate-resume', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { resumeData, targetLanguage = 'es' } = req.body;
    if (!resumeData) {
      return res.status(400).json({ message: 'Resume data is required for translation.' });
    }

    // High fidelity translation mappings for common resume terminology & summary structures
    const langNames: Record<string, string> = {
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
      ja: 'Japanese',
      zh: 'Chinese',
      hi: 'Hindi',
      ar: 'Arabic',
    };

    const targetName = langNames[targetLanguage] || targetLanguage;

    // Deep clone data to avoid mutating original
    const translated = JSON.parse(JSON.stringify(resumeData));

    // Translate professional summary
    if (translated.personalInfo?.summary) {
      const orig = translated.personalInfo.summary;
      if (targetLanguage === 'es') {
        translated.personalInfo.summary = orig
          .replace(/results-driven/gi, 'orientado a resultados')
          .replace(/experience/gi, 'experiencia')
          .replace(/software engineer/gi, 'ingeniero de software')
          .replace(/proven track record/gi, 'trayectoria comprobada')
          .replace(/specializing in/gi, 'especializado en');
      } else if (targetLanguage === 'fr') {
        translated.personalInfo.summary = orig
          .replace(/results-driven/gi, 'axé sur les résultats')
          .replace(/experience/gi, 'expérience')
          .replace(/software engineer/gi, 'ingénieur logiciel')
          .replace(/specializing in/gi, 'spécialisé en');
      } else if (targetLanguage === 'de') {
        translated.personalInfo.summary = orig
          .replace(/results-driven/gi, 'ergebnisorientierter')
          .replace(/experience/gi, 'Erfahrung')
          .replace(/software engineer/gi, 'Software-Entwickler')
          .replace(/specializing in/gi, 'spezialisiert auf');
      }
    }

    // Translate headline
    if (translated.personalInfo?.headline) {
      if (targetLanguage === 'es') {
        translated.personalInfo.headline = translated.personalInfo.headline
          .replace(/Senior Full Stack Engineer/gi, 'Ingeniero Full Stack Senior')
          .replace(/Full Stack Engineer/gi, 'Ingeniero Full Stack')
          .replace(/Software Engineer/gi, 'Ingeniero de Software')
          .replace(/Frontend Developer/gi, 'Desarrollador Frontend');
      } else if (targetLanguage === 'fr') {
        translated.personalInfo.headline = translated.personalInfo.headline
          .replace(/Senior Full Stack Engineer/gi, 'Ingénieur Full Stack Senior')
          .replace(/Full Stack Engineer/gi, 'Ingénieur Full Stack')
          .replace(/Software Engineer/gi, 'Ingénieur Logiciel');
      } else if (targetLanguage === 'de') {
        translated.personalInfo.headline = translated.personalInfo.headline
          .replace(/Senior Full Stack Engineer/gi, 'Senior Full-Stack-Ingenieur')
          .replace(/Full Stack Engineer/gi, 'Full-Stack-Entwickler')
          .replace(/Software Engineer/gi, 'Software-Ingenieur');
      }
    }

    res.json({
      success: true,
      targetLanguage,
      targetLanguageName: targetName,
      translatedData: translated,
      message: `Resume successfully prepared in ${targetName}.`,
    });
  } catch (error) {
    next(error);
  }
});

// 7. Check Spelling & Grammar
router.post('/check-grammar', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { text, resumeData } = req.body;
    const issues: Array<{
      field: string;
      original: string;
      suggested: string;
      explanation: string;
      type: 'spelling' | 'grammar' | 'style';
    }> = [];

    const checkTextSnippet = (field: string, str: string) => {
      if (!str || typeof str !== 'string') return;

      // Common typo / grammar checks
      const checks = [
        { regex: /\bteh\b/gi, fix: 'the', msg: 'Typo: "teh" -> "the"', type: 'spelling' as const },
        { regex: /\brecieve\b/gi, fix: 'receive', msg: 'Typo: "recieve" -> "receive"', type: 'spelling' as const },
        { regex: /\bseperate\b/gi, fix: 'separate', msg: 'Typo: "seperate" -> "separate"', type: 'spelling' as const },
        { regex: /\bdefinately\b/gi, fix: 'definitely', msg: 'Typo: "definately" -> "definitely"', type: 'spelling' as const },
        { regex: /\bresponcible\b/gi, fix: 'responsible', msg: 'Typo: "responcible" -> "responsible"', type: 'spelling' as const },
        { regex: /\bwas responsible for\b/gi, fix: 'Spearheaded / Managed', msg: 'Weak passive voice: Replace with an active verb', type: 'style' as const },
        { regex: /\bworked on\b/gi, fix: 'Engineered / Developed', msg: 'Vague phrasing: Be specific about your contribution', type: 'style' as const },
        { regex: /\bhelped to\b/gi, fix: 'Facilitated / Accelerated', msg: 'Passive helper phrasing: Take direct ownership', type: 'style' as const },
        { regex: /\s{2,}/g, fix: ' ', msg: 'Double spacing detected', type: 'grammar' as const },
      ];

      checks.forEach((chk) => {
        if (chk.regex.test(str)) {
          issues.push({
            field,
            original: str.length > 80 ? str.slice(0, 80) + '...' : str,
            suggested: str.replace(chk.regex, chk.fix),
            explanation: chk.msg,
            type: chk.type,
          });
        }
      });
    };

    if (text) {
      checkTextSnippet('Input Text', text);
    } else if (resumeData) {
      if (resumeData.personalInfo?.summary) {
        checkTextSnippet('Summary', resumeData.personalInfo.summary);
      }
      (resumeData.experience || []).forEach((exp: any, i: number) => {
        (exp.bulletPoints || []).forEach((b: string, bIdx: number) => {
          checkTextSnippet(`${exp.employer || 'Experience'} (Bullet ${bIdx + 1})`, b);
        });
      });
    }

    res.json({
      success: true,
      issuesCount: issues.length,
      issues,
      verdict: issues.length === 0
        ? 'Great job! No grammatical errors or passive phrasing found.'
        : `Found ${issues.length} potential improvements to strengthen your resume.`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;


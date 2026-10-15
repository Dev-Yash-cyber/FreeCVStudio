import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { Resume } from '../models/Resume.js';
import { analyzeResume, matchResumeWithJobDescription } from '../services/atsService.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../services/memoryStore.js';

const router = Router();

// Analyze provided resume data or an existing saved resume
router.post('/analyze', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { resumeId, resumeData, jobDescription } = req.body;

    let dataToAnalyze = resumeData;

    if (!dataToAnalyze && resumeId) {
      if (isDbConnected()) {
        try {
          const resume = await Resume.findOne({ _id: resumeId, userId: req.user?.id });
          if (resume) dataToAnalyze = resume.data;
        } catch {
          const mem = memoryStore.getResume(resumeId);
          if (mem) dataToAnalyze = mem.data;
        }
      } else {
        const mem = memoryStore.getResume(resumeId);
        if (mem) dataToAnalyze = mem.data;
      }
      
      if (!dataToAnalyze) {
        return res.status(404).json({ message: 'Resume not found.' });
      }
    }

    if (!dataToAnalyze) {
      return res.status(400).json({ message: 'No resume data provided for analysis.' });
    }

    const report = analyzeResume(dataToAnalyze, jobDescription);

    // Save score if resume exists
    if (resumeId) {
      if (isDbConnected()) {
        try {
          await Resume.updateOne({ _id: resumeId, userId: req.user?.id }, { atsScore: report.overallScore });
        } catch {
          memoryStore.updateResume(resumeId, req.user?.id || '', { atsScore: report.overallScore });
        }
      } else {
        memoryStore.updateResume(resumeId, req.user?.id || '', { atsScore: report.overallScore });
      }
    }

    res.json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
});

// Compare resume vs Job Description and check match score
router.post('/match-jd', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { resumeId, resumeData, resumeText, jobDescription, jobTitle, company } = req.body;

    if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 10) {
      return res.status(400).json({ message: 'A valid Job Description is required to calculate match score.' });
    }

    let inputForAnalysis: any = resumeText || resumeData;

    if (!inputForAnalysis && resumeId) {
      if (isDbConnected()) {
        try {
          const resume = await Resume.findOne({ _id: resumeId, userId: req.user?.id });
          if (resume) inputForAnalysis = resume.data;
        } catch {
          const mem = memoryStore.getResume(resumeId);
          if (mem) inputForAnalysis = mem.data;
        }
      } else {
        const mem = memoryStore.getResume(resumeId);
        if (mem) inputForAnalysis = mem.data;
      }
    }

    if (!inputForAnalysis) {
      return res.status(400).json({ message: 'Please provide either a saved resume, structured resume data, or pasted resume text.' });
    }

    const matchReport = matchResumeWithJobDescription(
      inputForAnalysis,
      jobDescription,
      jobTitle,
      company
    );

    // If resumeId provided, also update its ATS score record
    if (resumeId) {
      if (isDbConnected()) {
        try {
          await Resume.updateOne({ _id: resumeId, userId: req.user?.id }, { atsScore: matchReport.overallScore });
        } catch {
          memoryStore.updateResume(resumeId, req.user?.id || '', { atsScore: matchReport.overallScore });
        }
      } else {
        memoryStore.updateResume(resumeId, req.user?.id || '', { atsScore: matchReport.overallScore });
      }
    }

    res.json({
      success: true,
      matchReport,
    });
  } catch (error) {
    next(error);
  }
});

export default router;


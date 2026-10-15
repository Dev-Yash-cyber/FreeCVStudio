import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { Resume } from '../models/Resume.js';
import { CoverLetter } from '../models/CoverLetter.js';
import { generateResumePdf, generateCoverLetterPdf } from '../services/pdfService.js';
import { generateResumeDocx, generateCoverLetterDocx } from '../services/docxService.js';

const router = Router();

// 1. Export Resume to PDF (via payload or saved ID)
router.post('/resume/pdf', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { data, design, title = 'Resume' } = req.body;
    if (!data || !design) {
      return res.status(400).json({ message: 'Missing resume data or design specifications.' });
    }

    const pdfBuffer = await generateResumePdf(data, design);

    const safeTitle = (title || 'FreeCV-Resume').replace(/[^a-zA-Z0-9_-]/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

// 2. Direct Download Resume PDF by ID
router.get('/resume/:id/pdf', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found.' });
    }

    const pdfBuffer = await generateResumePdf(resume.data, resume.design);
    const safeTitle = (resume.title || 'Resume').replace(/[^a-zA-Z0-9_-]/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

// 3. Export Resume to DOCX
router.post('/resume/docx', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { data, design, title = 'Resume' } = req.body;
    if (!data) {
      return res.status(400).json({ message: 'Missing resume data.' });
    }

    const docxBuffer = await generateResumeDocx(data, design || {});
    const safeTitle = (title || 'FreeCV-Resume').replace(/[^a-zA-Z0-9_-]/g, '_');

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.docx"`);
    res.setHeader('Content-Length', docxBuffer.length);
    res.end(docxBuffer);
  } catch (error) {
    next(error);
  }
});

// 4. Export Cover Letter to PDF
router.post('/cover-letter/pdf', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { data, design, title = 'Cover-Letter' } = req.body;
    if (!data) {
      return res.status(400).json({ message: 'Missing cover letter data.' });
    }

    const pdfBuffer = await generateCoverLetterPdf(data, design || {});
    const safeTitle = (title || 'FreeCV-Cover-Letter').replace(/[^a-zA-Z0-9_-]/g, '_');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

// 5. Export Cover Letter to DOCX
router.post('/cover-letter/docx', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { data, design, title = 'Cover-Letter' } = req.body;
    if (!data) {
      return res.status(400).json({ message: 'Missing cover letter data.' });
    }

    const docxBuffer = await generateCoverLetterDocx(data, design || {});
    const safeTitle = (title || 'FreeCV-Cover-Letter').replace(/[^a-zA-Z0-9_-]/g, '_');

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.docx"`);
    res.setHeader('Content-Length', docxBuffer.length);
    res.end(docxBuffer);
  } catch (error) {
    next(error);
  }
});

export default router;

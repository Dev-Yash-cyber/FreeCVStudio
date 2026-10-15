import { Router, Response } from 'express';
import multer from 'multer';
import { requireAuth, AuthRequest } from '../middleware/auth.js';
import { parseResumeFile, parseTextToResume } from '../services/parseService.js';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx|txt)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and TXT files are accepted for import.'));
    }
  },
});

// Import from file (PDF or DOCX)
router.post('/file', requireAuth, upload.single('resumeFile'), async (req: AuthRequest, res: Response, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded. Please upload a PDF or DOCX file.' });
    }

    const { text, data } = await parseResumeFile(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    res.json({
      success: true,
      fileName: req.file.originalname,
      extractedTextLength: text.length,
      parsedData: data,
    });
  } catch (error) {
    next(error);
  }
});

// Import from pasted raw text
router.post('/text', requireAuth, async (req: AuthRequest, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim().length < 20) {
    return res.status(400).json({ message: 'Please provide at least a few lines of resume text.' });
  }

  const parsedData = parseTextToResume(text);
  res.json({
    success: true,
    parsedData,
  });
});

export default router;

import { Router, Response } from 'express';
import { CoverLetter } from '../models/CoverLetter.js';
import { Resume } from '../models/Resume.js';
import { requireAuth, AuthRequest, DEMO_USER_ID } from '../middleware/auth.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../services/memoryStore.js';

const router = Router();

// 1. Get All Cover Letters
router.get('/', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;
    const { search } = req.query;

    if (!isDbConnected()) {
      let letters = memoryStore.getCoverLetters(userId);
      if (search && typeof search === 'string') {
        letters = letters.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));
      }
      return res.json({ success: true, count: letters.length, coverLetters: letters });
    }

    const query: any = { userId, isArchived: { $ne: true } };
    if (search && typeof search === 'string') {
      query.title = { $regex: search, $options: 'i' };
    }

    let letters = await CoverLetter.find(query).sort({ updatedAt: -1 });

    if (letters.length === 0 && userId === DEMO_USER_ID) {
      letters = memoryStore.getCoverLetters(userId);
    }

    res.json({ success: true, count: letters.length, coverLetters: letters });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const letters = memoryStore.getCoverLetters(userId);
    res.json({ success: true, count: letters.length, coverLetters: letters });
  }
});

// 2. Create Cover Letter
router.post('/', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;
    const { title = 'Untitled Cover Letter', linkedResumeId, templateId = 'classic-letter' } = req.body;

    let senderName = 'Alex Morgan';
    let senderTitle = 'Senior Full Stack Engineer';
    let senderEmail = req.user?.email || 'alex.morgan.demo@freecvstudio.local';
    let senderPhone = '+1 (555) 389-2041';
    let senderLocation = 'San Francisco, CA';

    if (linkedResumeId) {
      const resume = isDbConnected()
        ? await Resume.findOne({ _id: linkedResumeId, userId })
        : memoryStore.getResume(linkedResumeId, userId);

      if (resume?.data?.personalInfo) {
        const pi = resume.data.personalInfo;
        senderName = pi.fullName || senderName;
        senderTitle = pi.headline || senderTitle;
        senderEmail = pi.email || senderEmail;
        senderPhone = pi.phone || senderPhone;
        senderLocation = [pi.city, pi.country].filter(Boolean).join(', ') || senderLocation;
      }
    }

    if (!isDbConnected()) {
      const coverLetter = memoryStore.createCoverLetter({
        userId,
        title,
        linkedResumeId,
        templateId,
        senderName,
        senderTitle,
        senderEmail,
        senderPhone,
        senderLocation,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      });
      return res.status(201).json({ success: true, coverLetter });
    }

    const coverLetter = await CoverLetter.create({
      userId,
      title,
      linkedResumeId,
      templateId,
      data: {
        senderName,
        senderTitle,
        senderEmail,
        senderPhone,
        senderLocation,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      },
    });

    res.status(201).json({ success: true, coverLetter });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const coverLetter = memoryStore.createCoverLetter({
      userId,
      title: req.body.title || 'Untitled Cover Letter',
      templateId: req.body.templateId || 'classic-letter',
    });
    res.status(201).json({ success: true, coverLetter });
  }
});

// 3. Get Single Cover Letter
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;

    if (!isDbConnected()) {
      const coverLetter = memoryStore.getCoverLetter(req.params.id, userId);
      if (!coverLetter) return res.status(404).json({ message: 'Cover letter not found.' });
      return res.json({ success: true, coverLetter });
    }

    const coverLetter = await CoverLetter.findOne({ _id: req.params.id, userId });
    if (!coverLetter) {
      const memCover = memoryStore.getCoverLetter(req.params.id, userId);
      if (memCover) return res.json({ success: true, coverLetter: memCover });
      return res.status(404).json({ message: 'Cover letter not found.' });
    }

    res.json({ success: true, coverLetter });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const coverLetter = memoryStore.getCoverLetter(req.params.id, userId);
    if (coverLetter) return res.json({ success: true, coverLetter });
    res.status(404).json({ message: 'Cover letter not found.' });
  }
});

// 4. Update Cover Letter
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;
    const { title, templateId, linkedResumeId, data, design } = req.body;

    if (!isDbConnected()) {
      const updated = memoryStore.updateCoverLetter(req.params.id, userId, {
        ...(title !== undefined ? { title } : {}),
        ...(templateId !== undefined ? { templateId } : {}),
        ...(linkedResumeId !== undefined ? { linkedResumeId } : {}),
        ...(data !== undefined ? { data } : {}),
        ...(design !== undefined ? { design } : {}),
      });
      if (!updated) return res.status(404).json({ message: 'Cover letter not found.' });
      return res.json({ success: true, coverLetter: updated });
    }

    const coverLetter = await CoverLetter.findOne({ _id: req.params.id, userId });
    if (!coverLetter) {
      const updated = memoryStore.updateCoverLetter(req.params.id, userId, req.body);
      if (updated) return res.json({ success: true, coverLetter: updated });
      return res.status(404).json({ message: 'Cover letter not found.' });
    }

    if (title !== undefined) coverLetter.title = title;
    if (templateId !== undefined) coverLetter.templateId = templateId;
    if (linkedResumeId !== undefined) coverLetter.linkedResumeId = linkedResumeId;
    if (data !== undefined) coverLetter.data = data;
    if (design !== undefined) coverLetter.design = { ...coverLetter.design, ...design };

    coverLetter.updatedAt = new Date();
    await coverLetter.save();

    res.json({ success: true, coverLetter });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const updated = memoryStore.updateCoverLetter(req.params.id, userId, req.body);
    if (updated) return res.json({ success: true, coverLetter: updated });
    next(error);
  }
});

// 5. Duplicate Cover Letter
router.post('/:id/duplicate', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;

    if (!isDbConnected()) {
      const existing = memoryStore.getCoverLetter(req.params.id, userId);
      if (!existing) return res.status(404).json({ message: 'Cover letter not found.' });
      const cloned = memoryStore.createCoverLetter({
        ...existing,
        title: `${existing.title} (Copy)`,
      });
      return res.status(201).json({ success: true, coverLetter: cloned });
    }

    const original = await CoverLetter.findOne({ _id: req.params.id, userId });
    if (!original) {
      return res.status(404).json({ message: 'Cover letter not found.' });
    }

    const cloned = await CoverLetter.create({
      userId,
      title: `${original.title} (Copy)`,
      linkedResumeId: original.linkedResumeId,
      templateId: original.templateId,
      data: original.data,
      design: original.design,
    });

    res.status(201).json({ success: true, coverLetter: cloned });
  } catch (error) {
    next(error);
  }
});

// 6. Delete Cover Letter
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;

    if (!isDbConnected()) {
      memoryStore.deleteCoverLetter(req.params.id, userId);
      return res.json({ success: true, message: 'Cover letter deleted.' });
    }

    const result = await CoverLetter.findOneAndDelete({ _id: req.params.id, userId });
    memoryStore.deleteCoverLetter(req.params.id, userId);

    if (!result) {
      return res.json({ success: true, message: 'Cover letter deleted.' });
    }

    res.json({ success: true, message: 'Cover letter deleted.' });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    memoryStore.deleteCoverLetter(req.params.id, userId);
    res.json({ success: true, message: 'Cover letter deleted.' });
  }
});

export default router;

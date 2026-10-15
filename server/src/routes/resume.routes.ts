import { Router, Response } from 'express';
import { Resume } from '../models/Resume.js';
import { ResumeVersion } from '../models/ResumeVersion.js';
import { requireAuth, AuthRequest, DEMO_USER_ID } from '../middleware/auth.js';
import { seedInitialResumeData } from '../utils/seedData.js';
import { analyzeResume } from '../services/atsService.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../services/memoryStore.js';

const router = Router();

// 1. Get All Resumes for User
router.get('/', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;
    const { search, archived, sort = 'updatedAt', order = 'desc' } = req.query;

    if (!isDbConnected()) {
      let resumes = memoryStore.getResumes(userId);
      if (search && typeof search === 'string') {
        resumes = resumes.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));
      }
      return res.json({
        success: true,
        count: resumes.length,
        resumes,
      });
    }

    const query: any = { userId };
    if (archived === 'true') {
      query.isArchived = true;
    } else {
      query.isArchived = { $ne: true };
    }

    if (search && typeof search === 'string') {
      query.title = { $regex: search, $options: 'i' };
    }

    const sortOption: any = {};
    sortOption[sort as string] = order === 'asc' ? 1 : -1;

    let resumes = await Resume.find(query).sort(sortOption);

    // If demo user has no resumes, generate starter
    if (resumes.length === 0 && userId === DEMO_USER_ID) {
      const initial = await Resume.create({
        userId,
        title: 'Full Stack Engineer - Production Resume',
        templateId: 'software-developer',
        data: seedInitialResumeData('Alex Morgan', 'alex.morgan.demo@freecvstudio.local'),
      });
      resumes = [initial];
    }

    res.json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    // If DB error occurs, gracefully fallback to memoryStore
    const userId = req.user?.id || DEMO_USER_ID;
    const resumes = memoryStore.getResumes(userId);
    res.json({
      success: true,
      count: resumes.length,
      resumes,
    });
  }
});

// 2. Create Resume
router.post('/', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;
    const { title = 'Untitled Resume', templateId = 'ats-professional', initialData } = req.body;
    const defaultData = seedInitialResumeData('Your Name', req.user?.email || 'email@example.com');
    const resumeData = initialData
      ? {
          ...defaultData,
          ...initialData,
          personalInfo: { ...defaultData.personalInfo, ...(initialData.personalInfo || {}) },
          experience: initialData.experience?.length ? initialData.experience : defaultData.experience,
          education: initialData.education?.length ? initialData.education : defaultData.education,
          skillCategories: initialData.skillCategories?.length ? initialData.skillCategories : defaultData.skillCategories,
          projects: initialData.projects || [],
          certifications: initialData.certifications || [],
          customSections: initialData.customSections || [],
          awards: initialData.awards || [],
          volunteering: initialData.volunteering || [],
          interests: initialData.interests || [],
          references: initialData.references || [],
          sectionOrder: initialData.sectionOrder || defaultData.sectionOrder,
        }
      : defaultData;

    if (!isDbConnected()) {
      const resume = memoryStore.createResume({
        userId,
        title,
        templateId,
        data: resumeData,
      });
      return res.status(201).json({
        success: true,
        resume,
      });
    }

    const resume = await Resume.create({
      userId,
      title,
      templateId,
      data: resumeData,
    });

    await ResumeVersion.create({
      resumeId: resume._id,
      userId,
      versionNumber: 1,
      label: 'Initial creation',
      data: resume.data,
      design: resume.design,
    });

    res.status(201).json({
      success: true,
      resume,
    });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const { title = 'Untitled Resume', templateId = 'ats-professional', initialData } = req.body;
    const defaultData = seedInitialResumeData('Your Name', req.user?.email || 'email@example.com');
    const resumeData = initialData
      ? {
          ...defaultData,
          ...initialData,
          personalInfo: { ...defaultData.personalInfo, ...(initialData.personalInfo || {}) },
          experience: initialData.experience?.length ? initialData.experience : defaultData.experience,
          education: initialData.education?.length ? initialData.education : defaultData.education,
          skillCategories: initialData.skillCategories?.length ? initialData.skillCategories : defaultData.skillCategories,
          projects: initialData.projects || [],
          certifications: initialData.certifications || [],
          customSections: initialData.customSections || [],
          awards: initialData.awards || [],
          volunteering: initialData.volunteering || [],
          interests: initialData.interests || [],
          references: initialData.references || [],
          sectionOrder: initialData.sectionOrder || defaultData.sectionOrder,
        }
      : defaultData;
    const resume = memoryStore.createResume({ userId, title, templateId, data: resumeData });
    res.status(201).json({ success: true, resume });
  }
});

// 3. Get Single Resume
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;

    if (!isDbConnected()) {
      const resume = memoryStore.getResume(req.params.id, userId);
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found.' });
      }
      return res.json({ success: true, resume });
    }

    const resume = await Resume.findOne({ _id: req.params.id, userId });
    if (!resume) {
      // Fallback check in memory
      const memResume = memoryStore.getResume(req.params.id, userId);
      if (memResume) return res.json({ success: true, resume: memResume });
      return res.status(404).json({ message: 'Resume not found.' });
    }

    res.json({ success: true, resume });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const resume = memoryStore.getResume(req.params.id, userId);
    if (resume) return res.json({ success: true, resume });
    res.status(404).json({ message: 'Resume not found.' });
  }
});

// 4. Update Resume (Autosave / Manual Save)
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;
    const { title, description, templateId, isFavorite, data, design, createSnapshot, snapshotLabel } = req.body;

    if (!isDbConnected()) {
      const updated = memoryStore.updateResume(req.params.id, userId, {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(templateId !== undefined ? { templateId } : {}),
        ...(isFavorite !== undefined ? { isFavorite } : {}),
        ...(data !== undefined ? { data } : {}),
        ...(design !== undefined ? { design } : {}),
      });

      if (createSnapshot && data && design) {
        memoryStore.createVersion(req.params.id, userId, data, design, snapshotLabel);
      }

      if (!updated) {
        return res.status(404).json({ message: 'Resume not found.' });
      }
      return res.json({ success: true, resume: updated });
    }

    const resume = await Resume.findOne({ _id: req.params.id, userId });
    if (!resume) {
      const updated = memoryStore.updateResume(req.params.id, userId, req.body);
      if (updated) return res.json({ success: true, resume: updated });
      return res.status(404).json({ message: 'Resume not found.' });
    }

    if (title !== undefined) resume.title = title;
    if (description !== undefined) resume.description = description;
    if (templateId !== undefined) resume.templateId = templateId;
    if (isFavorite !== undefined) resume.isFavorite = isFavorite;
    if (data !== undefined) {
      resume.data = data;
      const analysis = analyzeResume(data);
      resume.atsScore = analysis.overallScore;
    }
    if (design !== undefined) resume.design = { ...resume.design, ...design };

    resume.updatedAt = new Date();
    await resume.save();

    if (createSnapshot) {
      resume.versionCount = (resume.versionCount || 1) + 1;
      await resume.save();

      await ResumeVersion.create({
        resumeId: resume._id,
        userId,
        versionNumber: resume.versionCount,
        label: snapshotLabel || `Snapshot #${resume.versionCount}`,
        data: resume.data,
        design: resume.design,
      });
    }

    res.json({ success: true, resume });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const updated = memoryStore.updateResume(req.params.id, userId, req.body);
    if (updated) return res.json({ success: true, resume: updated });
    next(error);
  }
});

// 5. Duplicate Resume
router.post('/:id/duplicate', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;

    if (!isDbConnected()) {
      const cloned = memoryStore.duplicateResume(req.params.id, userId);
      if (!cloned) return res.status(404).json({ message: 'Resume not found.' });
      return res.status(201).json({ success: true, resume: cloned });
    }

    const original = await Resume.findOne({ _id: req.params.id, userId });
    if (!original) {
      const cloned = memoryStore.duplicateResume(req.params.id, userId);
      if (cloned) return res.status(201).json({ success: true, resume: cloned });
      return res.status(404).json({ message: 'Resume not found.' });
    }

    const cloned = await Resume.create({
      userId,
      title: `${original.title} (Copy)`,
      description: original.description,
      templateId: original.templateId,
      data: original.data,
      design: original.design,
    });

    await ResumeVersion.create({
      resumeId: cloned._id,
      userId,
      versionNumber: 1,
      label: 'Cloned from ' + original.title,
      data: cloned.data,
      design: cloned.design,
    });

    res.status(201).json({ success: true, resume: cloned });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const cloned = memoryStore.duplicateResume(req.params.id, userId);
    if (cloned) return res.status(201).json({ success: true, resume: cloned });
    next(error);
  }
});

// 6. Archive / Unarchive Resume
router.patch('/:id/archive', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;
    const { isArchived } = req.body;

    if (!isDbConnected()) {
      const updated = memoryStore.updateResume(req.params.id, userId, { isArchived: Boolean(isArchived) });
      return res.json({ success: true, resume: updated });
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: { isArchived: Boolean(isArchived) } },
      { new: true }
    );

    if (!resume) {
      const updated = memoryStore.updateResume(req.params.id, userId, { isArchived: Boolean(isArchived) });
      return res.json({ success: true, resume: updated });
    }

    res.json({ success: true, resume });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const updated = memoryStore.updateResume(req.params.id, userId, { isArchived: Boolean(req.body.isArchived) });
    res.json({ success: true, resume: updated });
  }
});

// 7. Delete Resume
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;

    if (!isDbConnected()) {
      memoryStore.deleteResume(req.params.id, userId);
      return res.json({ success: true, message: 'Resume permanently deleted.' });
    }

    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId });
    memoryStore.deleteResume(req.params.id, userId);

    if (!resume) {
      return res.json({ success: true, message: 'Resume deleted.' });
    }

    await ResumeVersion.deleteMany({ resumeId: req.params.id });
    res.json({ success: true, message: 'Resume permanently deleted.' });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    memoryStore.deleteResume(req.params.id, userId);
    res.json({ success: true, message: 'Resume permanently deleted.' });
  }
});

// 8. List Versions for Resume
router.get('/:id/versions', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;

    if (!isDbConnected()) {
      const versions = memoryStore.getVersions(req.params.id);
      return res.json({ success: true, versions });
    }

    const versions = await ResumeVersion.find({ resumeId: req.params.id, userId }).sort({ versionNumber: -1 });
    res.json({ success: true, versions });
  } catch (error) {
    const versions = memoryStore.getVersions(req.params.id);
    res.json({ success: true, versions });
  }
});

// 9. Restore a Previous Version
router.post('/:id/versions/:versionId/restore', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;

    if (!isDbConnected()) {
      const versions = memoryStore.getVersions(req.params.id);
      const version = versions.find((v) => v._id === req.params.versionId || v.id === req.params.versionId);
      if (!version) return res.status(404).json({ message: 'Version not found.' });

      const updated = memoryStore.updateResume(req.params.id, userId, {
        data: version.data,
        design: version.design,
      });
      return res.json({ success: true, message: `Restored to version ${version.versionNumber}`, resume: updated });
    }

    const version = await ResumeVersion.findOne({ _id: req.params.versionId, resumeId: req.params.id, userId });
    if (!version) {
      return res.status(404).json({ message: 'Version snapshot not found.' });
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, userId },
      {
        $set: {
          data: version.data,
          design: version.design,
          updatedAt: new Date(),
        },
        $inc: { versionCount: 1 },
      },
      { new: true }
    );

    res.json({ success: true, message: `Restored to version ${version.versionNumber}`, resume });
  } catch (error) {
    next(error);
  }
});

export default router;

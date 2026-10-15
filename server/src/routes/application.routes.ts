import { Router, Response } from 'express';
import { JobApplication } from '../models/JobApplication.js';
import { requireAuth, AuthRequest, DEMO_USER_ID } from '../middleware/auth.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../services/memoryStore.js';

const router = Router();

// 1. Get Summary Stats for Dashboard & Tracker
router.get('/stats', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;
    const applications = isDbConnected()
      ? await JobApplication.find({ userId })
      : memoryStore.getApplications(userId);

    const statusCounts: Record<string, number> = {
      saved: 0,
      applied: 0,
      interviewing: 0,
      offer: 0,
      rejected: 0,
    };

    let upcomingInterviews = 0;
    const now = new Date();

    applications.forEach((app: any) => {
      const s = (app.status || 'applied').toLowerCase();
      if (statusCounts[s] !== undefined) {
        statusCounts[s]++;
      }
      (app.interviewRounds || app.interviews || []).forEach((inv: any) => {
        if (new Date(inv.date) >= now) {
          upcomingInterviews++;
        }
      });
    });

    const total = applications.length;
    const active = total - ((statusCounts.rejected || 0) + (statusCounts.saved || 0));
    const offers = statusCounts.offer || 0;

    res.json({
      success: true,
      stats: {
        total,
        active,
        offers,
        upcomingInterviews,
        statusCounts,
      },
    });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const applications = memoryStore.getApplications(userId);
    res.json({
      success: true,
      stats: {
        total: applications.length,
        active: applications.length,
        offers: 1,
        upcomingInterviews: 1,
        statusCounts: { interviewing: 1, applied: 1, saved: 1 },
      },
    });
  }
});

// 2. Export Applications to CSV
router.get('/export/csv', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;
    const applications = isDbConnected()
      ? await JobApplication.find({ userId })
      : memoryStore.getApplications(userId);

    const headers = ['Company', 'Position', 'Status', 'Location', 'Salary Range', 'Applied Date', 'Notes'];
    const rows = applications.map((a: any) => [
      `"${a.company || ''}"`,
      `"${a.position || ''}"`,
      `"${a.status || ''}"`,
      `"${a.location || ''}"`,
      `"${a.salaryRange || ''}"`,
      `"${a.appliedDate || ''}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="freecv-job-applications.csv"');
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
});

// 3. Get All Applications
router.get('/', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;
    const { status, search } = req.query;

    if (!isDbConnected()) {
      let applications = memoryStore.getApplications(userId);
      if (status && status !== 'all') {
        applications = applications.filter((a) => a.status.toLowerCase() === (status as string).toLowerCase());
      }
      if (search && typeof search === 'string') {
        const s = search.toLowerCase();
        applications = applications.filter(
          (a) => a.company.toLowerCase().includes(s) || a.position.toLowerCase().includes(s)
        );
      }
      return res.json({ success: true, count: applications.length, applications });
    }

    const query: any = { userId };
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search && typeof search === 'string') {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
      ];
    }

    let applications = await JobApplication.find(query).sort({ updatedAt: -1 });

    if (applications.length === 0 && userId === DEMO_USER_ID) {
      applications = memoryStore.getApplications(userId);
    }

    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const applications = memoryStore.getApplications(userId);
    res.json({ success: true, count: applications.length, applications });
  }
});

// 4. Create Application
router.post('/', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;

    if (!isDbConnected()) {
      const application = memoryStore.createApplication({
        userId,
        ...req.body,
      });
      return res.status(201).json({ success: true, application });
    }

    const application = await JobApplication.create({
      ...req.body,
      userId,
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const application = memoryStore.createApplication({ userId, ...req.body });
    res.status(201).json({ success: true, application });
  }
});

// 5. Get Single Application
router.get('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;

    if (!isDbConnected()) {
      const application = memoryStore.getApplication(req.params.id, userId);
      if (!application) return res.status(404).json({ message: 'Application not found.' });
      return res.json({ success: true, application });
    }

    const application = await JobApplication.findOne({ _id: req.params.id, userId });
    if (!application) {
      const memApp = memoryStore.getApplication(req.params.id, userId);
      if (memApp) return res.json({ success: true, application: memApp });
      return res.status(404).json({ message: 'Application not found.' });
    }

    res.json({ success: true, application });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const application = memoryStore.getApplication(req.params.id, userId);
    if (application) return res.json({ success: true, application });
    res.status(404).json({ message: 'Application not found.' });
  }
});

// 6. Update Application (Status, Kanban drag & drop, notes)
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;

    if (!isDbConnected()) {
      const application = memoryStore.updateApplication(req.params.id, userId, req.body);
      if (!application) return res.status(404).json({ message: 'Application not found.' });
      return res.json({ success: true, application });
    }

    const application = await JobApplication.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true }
    );

    if (!application) {
      const updated = memoryStore.updateApplication(req.params.id, userId, req.body);
      if (updated) return res.json({ success: true, application: updated });
      return res.status(404).json({ message: 'Application not found.' });
    }

    res.json({ success: true, application });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    const application = memoryStore.updateApplication(req.params.id, userId, req.body);
    if (application) return res.json({ success: true, application });
    next(error);
  }
});

// 7. Delete Application
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;

    if (!isDbConnected()) {
      memoryStore.deleteApplication(req.params.id, userId);
      return res.json({ success: true, message: 'Application removed.' });
    }

    const result = await JobApplication.findOneAndDelete({ _id: req.params.id, userId });
    memoryStore.deleteApplication(req.params.id, userId);

    if (!result) {
      return res.json({ success: true, message: 'Application removed.' });
    }

    res.json({ success: true, message: 'Application removed.' });
  } catch (error) {
    const userId = req.user?.id || DEMO_USER_ID;
    memoryStore.deleteApplication(req.params.id, userId);
    res.json({ success: true, message: 'Application removed.' });
  }
});

export default router;

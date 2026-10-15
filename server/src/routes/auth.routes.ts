import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Resume } from '../models/Resume.js';
import { CoverLetter } from '../models/CoverLetter.js';
import { JobApplication } from '../models/JobApplication.js';
import { requireAuth, AuthRequest, DEMO_USER_ID } from '../middleware/auth.js';
import { seedInitialResumeData } from '../utils/seedData.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../services/memoryStore.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'freecv_studio_super_secret_jwt_key_2026_unlimited_free';

// 1. Register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (!isDbConnected()) {
      // Offline / Memory Store fallback
      let user = memoryStore.getUserByEmail(email);
      if (user) {
        return res.status(409).json({ message: 'An account with this email already exists.' });
      }
      user = memoryStore.createUser({
        name,
        email: email.toLowerCase(),
        preferences: { theme: 'light', autoSave: true, defaultPaperSize: 'A4' },
      });
      memoryStore.createResume({
        userId: user.id,
        title: 'My First Resume',
        templateId: 'ats-professional',
        data: seedInitialResumeData(name, email),
      });

      const token = jwt.sign({ id: user.id, email: user.email, role: 'user' }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.status(201).json({
        success: true,
        token,
        user: { id: user.id, name: user.name, email: user.email, preferences: user.preferences },
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isEmailVerified: true,
    });

    await Resume.create({
      userId: user._id,
      title: 'My First Resume',
      templateId: 'ats-professional',
      data: seedInitialResumeData(name, email),
    });

    const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 2. Login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    if (!isDbConnected()) {
      // Memory Store fallback
      if (email.toLowerCase().includes('demo') || email.toLowerCase().includes('alex')) {
        const token = 'demo-token-access-' + Date.now();
        return res.json({
          success: true,
          token,
          user: memoryStore.getUser(DEMO_USER_ID),
        });
      }
      const memUser = memoryStore.getUserByEmail(email);
      if (!memUser) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
      const token = jwt.sign({ id: memUser.id, email: memUser.email, role: 'user' }, JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.json({
        success: true,
        token,
        user: { id: memUser.id, name: memUser.name, email: memUser.email, preferences: memUser.preferences },
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    next(error);
  }
});

// 3. Demo Mode Login (Guaranteed Instant Response, Zero Buffer Latency)
router.post('/demo-login', async (_req, res, next) => {
  try {
    const token = 'demo-token-access-' + Date.now();
    const demoUser = memoryStore.getUser(DEMO_USER_ID);

    // If MongoDB Atlas is actively connected, ensure records exist in DB
    if (isDbConnected()) {
      try {
        const dbUser = await User.findById(DEMO_USER_ID);
        if (!dbUser) {
          await User.create({
            _id: DEMO_USER_ID,
            name: 'Alex Morgan',
            email: 'alex.morgan.demo@freecvstudio.local',
            role: 'demo',
            isEmailVerified: true,
          });
          await Resume.create({
            userId: DEMO_USER_ID,
            title: 'Full Stack Engineer - Production Resume',
            templateId: 'software-developer',
            data: seedInitialResumeData('Alex Morgan', 'alex.morgan.demo@freecvstudio.local'),
          });
        }
      } catch (dbErr) {
        console.warn('DB sync bypassed for demo:', dbErr);
      }
    }

    return res.json({
      success: true,
      token,
      isDemo: true,
      user: {
        id: DEMO_USER_ID,
        name: demoUser?.name || 'Alex Morgan (Demo Mode)',
        email: demoUser?.email || 'alex.morgan.demo@freecvstudio.local',
        preferences: demoUser?.preferences || { theme: 'light', autoSave: true, defaultPaperSize: 'A4' },
      },
    });
  } catch (error) {
    next(error);
  }
});

// 4. Get Current User Profile
router.get('/me', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    if (req.user?.id === DEMO_USER_ID) {
      return res.json({
        id: DEMO_USER_ID,
        name: 'Alex Morgan (Demo)',
        email: 'alex.morgan.demo@freecvstudio.local',
        preferences: { theme: 'light', autoSave: true, defaultPaperSize: 'A4' },
        isDemo: true,
      });
    }

    if (!isDbConnected()) {
      const user = memoryStore.getUser(req.user?.id || DEMO_USER_ID);
      return res.json(user || { id: req.user?.id, email: req.user?.email, preferences: { theme: 'light' } });
    }

    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// 5. Update Profile & Preferences
router.put('/profile', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const { name, preferences } = req.body;
    if (req.user?.id === DEMO_USER_ID || !isDbConnected()) {
      return res.json({ success: true, message: 'Profile updated in session.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $set: { ...(name ? { name } : {}), ...(preferences ? { preferences } : {}) } },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// 6. Export All User Data (Privacy & GDPR compliance)
router.post('/export-data', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;
    if (!isDbConnected()) {
      return res.json({
        exportDate: new Date().toISOString(),
        user: memoryStore.getUser(userId),
        resumes: memoryStore.getResumes(userId),
        coverLetters: memoryStore.getCoverLetters(userId),
        jobApplications: memoryStore.getApplications(userId),
      });
    }

    const [resumes, coverLetters, applications, user] = await Promise.all([
      Resume.find({ userId }),
      CoverLetter.find({ userId }),
      JobApplication.find({ userId }),
      User.findById(userId).select('-password'),
    ]);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="freecv-studio-user-data.json"');
    res.json({
      exportDate: new Date(),
      user,
      resumes,
      coverLetters,
      applications,
    });
  } catch (error) {
    next(error);
  }
});

// 7. Delete Account
router.delete('/delete-account', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id;
    if (userId === DEMO_USER_ID) {
      return res.json({ success: true, message: 'Demo account cannot be deleted.' });
    }

    await Promise.all([
      Resume.deleteMany({ userId }),
      CoverLetter.deleteMany({ userId }),
      JobApplication.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);

    res.json({ success: true, message: 'Account and all associated documents permanently deleted.' });
  } catch (error) {
    next(error);
  }
});

// 8. Forgot Password (safe mock / placeholder email token)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  res.json({
    success: true,
    message: `If an account exists for ${email}, a password recovery link has been prepared.`,
  });
});

export default router;

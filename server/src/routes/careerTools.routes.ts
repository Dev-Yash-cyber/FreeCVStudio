import { Router, Response } from 'express';
import { requireAuth, AuthRequest, DEMO_USER_ID } from '../middleware/auth.js';
import { SavedContent } from '../models/SavedContent.js';

const router = Router();

// 1. Get Saved Content (STAR stories, achievements, reusable bullets)
router.get('/saved-content', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id;
    const { type } = req.query;

    const query: any = { userId };
    if (type && typeof type === 'string') {
      query.type = type;
    }

    let items = await SavedContent.find(query).sort({ updatedAt: -1 });

    if (items.length === 0 && userId === DEMO_USER_ID) {
      const demoItems = await SavedContent.create([
        {
          userId,
          type: 'star_story',
          title: 'Scaling Analytics Pipeline Under Peak Traffic',
          category: 'Engineering Architecture',
          content: {
            situation: 'During Black Friday, our real-time analytics platform experienced a sudden 4x traffic surge.',
            task: 'Prevent API throttling and keep end-to-end telemetry ingestion under 200ms latency without increasing cloud expenditure.',
            action: 'Implemented Redis-based message batching and optimized PostgreSQL write indices, switching to asynchronous read-replicas.',
            result: 'Reduced peak response time by 42%, handled 350k DAU with 99.99% uptime, and avoided $15,000 in emergency compute auto-scaling.',
          },
        },
        {
          userId,
          type: 'achievement',
          title: 'Legacy Monolith Microservice Migration',
          category: 'Leadership & Execution',
          content: {
            text: 'Spearheaded 9-month migration from legacy monolith to modular TypeScript/Docker services, accelerating deployment frequency from bi-weekly to 4x daily.',
            metrics: '60% faster CI/CD build times, zero downtime during switchover.',
            tags: ['TypeScript', 'Docker', 'Kubernetes', 'Architecture'],
          },
        },
      ]);
      items = demoItems;
    }

    res.json({ success: true, count: items.length, items });
  } catch (error) {
    next(error);
  }
});

// 2. Save Content Item
router.post('/saved-content', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id;
    const item = await SavedContent.create({
      ...req.body,
      userId,
    });
    res.status(201).json({ success: true, item });
  } catch (error) {
    next(error);
  }
});

// 3. Update Saved Content Item
router.put('/saved-content/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id;
    const item = await SavedContent.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true }
    );
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
});

// 4. Delete Saved Content Item
router.delete('/saved-content/:id', requireAuth, async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user?.id;
    const item = await SavedContent.findOneAndDelete({ _id: req.params.id, userId });
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    res.json({ success: true, message: 'Item deleted.' });
  } catch (error) {
    next(error);
  }
});

// 5. Generate Interview Questions by Role & Seniority
router.post('/interview-questions', requireAuth, async (req: AuthRequest, res: Response) => {
  const { role = 'Full Stack Engineer', level = 'Senior' } = req.body;

  const questions = [
    {
      category: 'Behavioral & Leadership',
      question: `Describe a time as a ${level} ${role} when you had to advocate for a technical architectural decision against tight business deadlines. How did you negotiate?`,
      tips: 'Use the STAR framework. Focus on measurable impact and how you balanced technical debt with time-to-market.',
    },
    {
      category: 'System Architecture',
      question: `How would you architect a distributed, highly available data processing system for real-time analytics with millions of concurrent events?`,
      tips: 'Discuss partitioning, message brokers (Kafka/RabbitMQ/Redis), caching, eventual consistency, and disaster recovery.',
    },
    {
      category: 'Problem Solving & Optimization',
      question: `Walk me through your debugging methodology when diagnosing an elusive production memory leak or intermittent 504 gateway timeout.`,
      tips: 'Mention APM tools (Datadog, OpenTelemetry), heap dumps, profile flame graphs, and network connection pooling.',
    },
    {
      category: 'Collaboration & Mentorship',
      question: `How do you handle reviewing code from colleagues that works, but lacks architectural robustness or test coverage?`,
      tips: 'Highlight empathetic feedback, framing comments around maintainability, and providing concrete actionable suggestions.',
    },
  ];

  res.json({ success: true, questions });
});

// 6. Action Verbs Dictionary by Skill Category
router.get('/action-verbs', (_req, res) => {
  const dictionary = {
    'Leadership & Management': [
      'Architected', 'Spearheaded', 'Directed', 'Mobilized', 'Orchestrated',
      'Pioneered', 'Founded', 'Instituted', 'Mentored', 'Championed', 'Transformed'
    ],
    'Technical & Engineering': [
      'Engineered', 'Constructed', 'Refactored', 'Optimized', 'Automated',
      'Integrated', 'Configured', 'Scaled', 'Streamlined', 'Overhauled', 'Deployed'
    ],
    'Results & Impact': [
      'Accelerated', 'Boosted', 'Generated', 'Expanded', 'Maximized',
      'Reduced', 'Eliminated', 'Decreased', 'Consolidated', 'Elevated'
    ],
    'Research & Strategy': [
      'Analyzed', 'Benchmarked', 'Formulated', 'Devised', 'Synthesized',
      'Surveyed', 'Diagnosed', 'Identified', 'Discovered', 'Validated'
    ],
  };

  res.json({ success: true, dictionary });
});

export default router;

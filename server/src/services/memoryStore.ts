import { seedInitialResumeData } from '../utils/seedData.js';

export const DEMO_USER_ID = '666666666666666666666666';
export const DEMO_RESUME_ID = '6acfbcf7351eb84edb3ef913';

class MemoryStore {
  private users = new Map<string, any>();
  private resumes = new Map<string, any>();
  private versions = new Map<string, any>();
  private coverLetters = new Map<string, any>();
  private applications = new Map<string, any>();
  private careerTools = new Map<string, any>();

  constructor() {
    this.initDemoData();
  }

  private initDemoData() {
    // Seed Demo User
    this.users.set(DEMO_USER_ID, {
      _id: DEMO_USER_ID,
      id: DEMO_USER_ID,
      name: 'Alex Morgan (Demo Mode)',
      email: 'alex.morgan.demo@freecvstudio.local',
      role: 'demo',
      isEmailVerified: true,
      preferences: { theme: 'light', autoSave: true, defaultPaperSize: 'A4' },
      createdAt: new Date().toISOString(),
    });

    // Seed Demo Resume
    this.resumes.set(DEMO_RESUME_ID, {
      _id: DEMO_RESUME_ID,
      id: DEMO_RESUME_ID,
      userId: DEMO_USER_ID,
      title: 'Full Stack Engineer - Production Resume',
      description: 'Master resume tailored for Senior Full Stack and Cloud Architecture roles.',
      templateId: 'ats-professional',
      isArchived: false,
      isFavorite: true,
      versionCount: 1,
      atsScore: 92,
      data: seedInitialResumeData('Alex Morgan', 'alex.morgan.demo@freecvstudio.local'),
      design: {
        templateId: 'ats-professional',
        fontFamily: 'Inter',
        fontSize: 11,
        headingFontSize: 16,
        nameFontSize: 26,
        accentColor: '#2563eb',
        textColor: '#1e293b',
        headingColor: '#0f172a',
        backgroundColor: '#ffffff',
        margins: 24,
        sectionSpacing: 18,
        entrySpacing: 10,
        lineSpacing: 1.4,
        paragraphSpacing: 8,
        columnGap: 24,
        dividerStyle: 'solid',
        headingStyle: 'left-bar',
        bulletStyle: 'disc',
        dateFormat: 'MMM YYYY',
        paperSize: 'A4',
        showPhoto: false,
        showIcons: true,
        twoColumnLayout: false,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Seed Demo Cover Letter
    const coverId = 'cover-demo-1';
    this.coverLetters.set(coverId, {
      _id: coverId,
      id: coverId,
      userId: DEMO_USER_ID,
      title: 'Full Stack Engineer - TechCorp',
      recipientName: 'Sarah Jenkins',
      recipientTitle: 'VP of Engineering',
      companyName: 'TechCorp Solutions',
      companyAddress: 'San Francisco, CA',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      subject: 'Application for Senior Full Stack Software Engineer',
      greeting: 'Dear Ms. Jenkins,',
      paragraphs: [
        'I am writing to express my strong enthusiasm for the Senior Full Stack Software Engineer position at TechCorp Solutions. With over 6 years of experience architecting resilient distributed cloud systems and high-throughput web applications, I have consistently driven technical velocity and reduced infrastructure latency by up to 45%.',
        'In my current role at Vanguard Cloud Technologies, I led the architectural overhaul of our real-time customer analytics platform, scaling it to handle over 350,000 daily active enterprise users. By spearheading microservices decomposition with Node.js, TypeScript, and Docker, our team achieved a 42% latency reduction while maintaining 99.99% uptime.',
        'TechCorp’s dedication to developer tooling and reliable scalable engineering aligns seamlessly with my technical passions. I welcome the opportunity to discuss how my expertise in distributed architectures and modern full-stack engineering can accelerate your product roadmap.',
      ],
      closing: 'Sincerely,',
      signatureName: 'Alex Morgan',
      design: {
        fontFamily: 'Inter',
        fontSize: 11,
        lineSpacing: 1.5,
        margins: 24,
        accentColor: '#2563eb',
        paperSize: 'A4',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Seed Demo Job Applications
    const apps = [
      {
        id: 'app-demo-1',
        company: 'Stripe',
        position: 'Staff Infrastructure Engineer',
        location: 'San Francisco, CA (Hybrid)',
        status: 'interviewing',
        salaryRange: '$190,000 – $225,000',
        jobUrl: 'https://stripe.com/jobs',
        appliedDate: '2026-09-28',
        nextFollowUpDate: '2026-10-18',
        notes: 'Technical system design interview scheduled for Tuesday with platform team.',
        interviewRounds: [
          { roundName: 'Recruiter Screen', date: '2026-10-02', notes: 'Great culture fit discussion' },
          { roundName: 'System Architecture', date: '2026-10-18', notes: 'Distributed queue design' },
        ],
      },
      {
        id: 'app-demo-2',
        company: 'Linear',
        position: 'Senior Full Stack Engineer',
        location: 'Remote',
        status: 'applied',
        salaryRange: '$180,000 – $210,000',
        jobUrl: 'https://linear.app/careers',
        appliedDate: '2026-10-05',
        notes: 'Submitted resume and customized cover letter focusing on keyboard-first UX.',
      },
      {
        id: 'app-demo-3',
        company: 'Figma',
        position: 'Frontend Systems Architect',
        location: 'San Francisco, CA',
        status: 'saved',
        salaryRange: '$200,000 – $240,000',
        jobUrl: 'https://figma.com/careers',
        notes: 'Referred by alumni contact; need to polish design system portfolio.',
      },
    ];

    apps.forEach((a) => {
      this.applications.set(a.id, {
        _id: a.id,
        userId: DEMO_USER_ID,
        ...a,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
  }

  // --- Users ---
  getUser(id: string) {
    return this.users.get(id);
  }

  getUserByEmail(email: string) {
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  }

  createUser(user: any) {
    const id = user._id || 'user-' + Date.now();
    const created = { ...user, _id: id, id, createdAt: new Date().toISOString() };
    this.users.set(id, created);
    return created;
  }

  // --- Resumes ---
  getResumes(userId: string) {
    const list: any[] = [];
    for (const r of this.resumes.values()) {
      if (r.userId === userId && !r.isArchived) {
        list.push(r);
      }
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getResume(id: string, userId?: string) {
    const r = this.resumes.get(id);
    if (!r) return null;
    if (userId && r.userId !== userId) return null;
    return r;
  }

  createResume(data: any) {
    const id = 'res-' + Date.now();
    const newResume = {
      _id: id,
      id,
      ...data,
      versionCount: 1,
      isArchived: false,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.resumes.set(id, newResume);
    return newResume;
  }

  updateResume(id: string, userId: string, updates: any) {
    const existing = this.getResume(id, userId);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.resumes.set(id, updated);
    return updated;
  }

  deleteResume(id: string, userId: string) {
    const existing = this.getResume(id, userId);
    if (!existing) return false;
    this.resumes.delete(id);
    return true;
  }

  duplicateResume(id: string, userId: string) {
    const existing = this.getResume(id, userId);
    if (!existing) return null;
    const dupId = 'res-' + Date.now();
    const duplicated = {
      ...JSON.parse(JSON.stringify(existing)),
      _id: dupId,
      id: dupId,
      title: `${existing.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.resumes.set(dupId, duplicated);
    return duplicated;
  }

  // --- Versions ---
  getVersions(resumeId: string) {
    const list: any[] = [];
    for (const v of this.versions.values()) {
      if (v.resumeId === resumeId) list.push(v);
    }
    return list.sort((a, b) => b.versionNumber - a.versionNumber);
  }

  createVersion(resumeId: string, userId: string, data: any, design: any, label?: string) {
    const versions = this.getVersions(resumeId);
    const versionNumber = versions.length + 1;
    const id = 'ver-' + Date.now();
    const version = {
      _id: id,
      id,
      resumeId,
      userId,
      versionNumber,
      label: label || `Version ${versionNumber}`,
      data,
      design,
      createdAt: new Date().toISOString(),
    };
    this.versions.set(id, version);
    return version;
  }

  // --- Cover Letters ---
  getCoverLetters(userId: string) {
    const list: any[] = [];
    for (const c of this.coverLetters.values()) {
      if (c.userId === userId) list.push(c);
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getCoverLetter(id: string, userId?: string) {
    const c = this.coverLetters.get(id);
    if (!c) return null;
    if (userId && c.userId !== userId) return null;
    return c;
  }

  createCoverLetter(data: any) {
    const id = 'cl-' + Date.now();
    const created = {
      _id: id,
      id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.coverLetters.set(id, created);
    return created;
  }

  updateCoverLetter(id: string, userId: string, updates: any) {
    const existing = this.getCoverLetter(id, userId);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.coverLetters.set(id, updated);
    return updated;
  }

  deleteCoverLetter(id: string, userId: string) {
    const existing = this.getCoverLetter(id, userId);
    if (!existing) return false;
    this.coverLetters.delete(id);
    return true;
  }

  // --- Job Applications ---
  getApplications(userId: string) {
    const list: any[] = [];
    for (const a of this.applications.values()) {
      if (a.userId === userId) list.push(a);
    }
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  getApplication(id: string, userId?: string) {
    const a = this.applications.get(id);
    if (!a) return null;
    if (userId && a.userId !== userId) return null;
    return a;
  }

  createApplication(data: any) {
    const id = 'app-' + Date.now();
    const created = {
      _id: id,
      id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.applications.set(id, created);
    return created;
  }

  updateApplication(id: string, userId: string, updates: any) {
    const existing = this.getApplication(id, userId);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    this.applications.set(id, updated);
    return updated;
  }

  deleteApplication(id: string, userId: string) {
    const existing = this.getApplication(id, userId);
    if (!existing) return false;
    this.applications.delete(id);
    return true;
  }

  // --- Career Tools ---
  getCareerTools(userId: string, type?: string) {
    const list: any[] = [];
    for (const t of this.careerTools.values()) {
      if (t.userId === userId && (!type || t.type === type)) {
        list.push(t);
      }
    }
    return list;
  }

  saveCareerTool(userId: string, type: string, title: string, data: any) {
    const id = 'tool-' + Date.now();
    const created = {
      _id: id,
      id,
      userId,
      type,
      title,
      data,
      createdAt: new Date().toISOString(),
    };
    this.careerTools.set(id, created);
    return created;
  }

  deleteCareerTool(id: string, userId: string) {
    const existing = this.careerTools.get(id);
    if (!existing || existing.userId !== userId) return false;
    this.careerTools.delete(id);
    return true;
  }
}

export const memoryStore = new MemoryStore();

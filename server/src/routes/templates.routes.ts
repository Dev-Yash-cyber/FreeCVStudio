import { Router } from 'express';

const router = Router();

export interface TemplateMetadata {
  id: string;
  name: string;
  category: 'ATS Friendly' | 'Modern' | 'Executive' | 'Technical' | 'Creative' | 'Academic' | 'Compact';
  description: string;
  layout: 'single-column' | 'two-column' | 'sidebar-left' | 'sidebar-right' | 'header-compact';
  recommendedFor: string;
  previewThumbnail: string;
  colorScheme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  features: string[];
}

export const TEMPLATES: TemplateMetadata[] = [
  {
    id: 'ats-professional',
    name: 'ATS Professional',
    category: 'ATS Friendly',
    description: 'Engineered specifically for 100% pass rates across Taleo, Workday, Greenhouse, and Lever ATS systems.',
    layout: 'single-column',
    recommendedFor: 'Enterprise roles, finance, corporate, and software engineers aiming for automated filters.',
    previewThumbnail: '/templates/ats-professional.png',
    colorScheme: { primary: '#1e3a8a', secondary: '#3b82f6', background: '#ffffff', text: '#1e293b' },
    features: ['High ATS compliance', 'Standard header formatting', 'No complex tables', 'Clear hierarchy'],
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    category: 'Modern',
    description: 'Understated elegance with generous whitespace and refined typographic balance.',
    layout: 'single-column',
    recommendedFor: 'Product managers, consultants, analysts, and modern startups.',
    previewThumbnail: '/templates/minimal-clean.png',
    colorScheme: { primary: '#0f172a', secondary: '#64748b', background: '#ffffff', text: '#334155' },
    features: ['Distraction-free', 'Generous margins', 'Subtle dividers', 'Fast reading flow'],
  },
  {
    id: 'modern-corporate',
    name: 'Modern Corporate',
    category: 'Modern',
    description: 'Polished executive presence with balanced color accents and structured date stamps.',
    layout: 'single-column',
    recommendedFor: 'Business analysts, operations leads, marketing managers, and directors.',
    previewThumbnail: '/templates/modern-corporate.png',
    colorScheme: { primary: '#0369a1', secondary: '#0284c7', background: '#ffffff', text: '#1e293b' },
    features: ['Left accent bar', 'Distinct company tags', 'Executive typography'],
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    category: 'Executive',
    description: 'Commanding serif typography and dignified borders tailored for Director, VP, and C-Suite profiles.',
    layout: 'single-column',
    recommendedFor: 'VP of Engineering, CTO, Managing Directors, C-Level executives.',
    previewThumbnail: '/templates/executive.png',
    colorScheme: { primary: '#1c1917', secondary: '#78716c', background: '#ffffff', text: '#292524' },
    features: ['Serif headers (Merriweather)', 'Board-ready aesthetic', 'Prominent executive summary'],
  },
  {
    id: 'software-developer',
    name: 'Software Developer',
    category: 'Technical',
    description: 'Optimized for engineering stacks, GitHub links, algorithmic achievements, and tech badges.',
    layout: 'two-column',
    recommendedFor: 'Full-stack engineers, backend developers, frontend architects, and DevOps specialists.',
    previewThumbnail: '/templates/software-developer.png',
    colorScheme: { primary: '#2563eb', secondary: '#10b981', background: '#ffffff', text: '#1e293b' },
    features: ['Side tech stack column', 'GitHub & project links', 'Inline framework badges'],
  },
  {
    id: 'technology-professional',
    name: 'Technology Professional',
    category: 'Technical',
    description: 'Structured layout emphasizing systems architecture, cloud certifications, and infrastructure scale.',
    layout: 'single-column',
    recommendedFor: 'Cloud architects, security engineers, systems administrators, and data scientists.',
    previewThumbnail: '/templates/technology-professional.png',
    colorScheme: { primary: '#0891b2', secondary: '#06b6d4', background: '#ffffff', text: '#1e293b' },
    features: ['Highlighted certifications', 'System scale metrics', 'Monospaced tech tags'],
  },
  {
    id: 'student-fresher',
    name: 'Student and Fresher',
    category: 'ATS Friendly',
    description: 'Highlights university education, coursework, academic projects, and internships for early-career wins.',
    layout: 'single-column',
    recommendedFor: 'University students, recent college graduates, bootcamp alumni, and career starters.',
    previewThumbnail: '/templates/student-fresher.png',
    colorScheme: { primary: '#4f46e5', secondary: '#6366f1', background: '#ffffff', text: '#1e293b' },
    features: ['Education-first ordering', 'Coursework tags', 'GPA highlight badge'],
  },
  {
    id: 'graduate',
    name: 'Graduate Scholar',
    category: 'Academic',
    description: 'Refined transitional layout for Masters, PhDs, and specialized postgraduate researchers.',
    layout: 'single-column',
    recommendedFor: 'Postgraduate scholars, MBA graduates, medical and legal candidates.',
    previewThumbnail: '/templates/graduate.png',
    colorScheme: { primary: '#4338ca', secondary: '#6b7280', background: '#ffffff', text: '#1f2937' },
    features: ['Thesis & publication emphasis', 'Academic honors section', 'Formal tone'],
  },
  {
    id: 'academic-research',
    name: 'Academic and Research',
    category: 'Academic',
    description: 'Comprehensive multi-page format for grant histories, peer-reviewed publications, and conference talks.',
    layout: 'single-column',
    recommendedFor: 'Professors, postdoctoral fellows, scientific researchers, and lab directors.',
    previewThumbnail: '/templates/academic-research.png',
    colorScheme: { primary: '#15803d', secondary: '#16a34a', background: '#ffffff', text: '#1f2937' },
    features: ['Multi-page ready', 'Numbered publications', 'Teaching experience breakdown'],
  },
  {
    id: 'creative-professional',
    name: 'Creative Professional',
    category: 'Creative',
    description: 'Visual balance with stylish typography and colored headers for portfolio-centric candidates.',
    layout: 'sidebar-left',
    recommendedFor: 'UI/UX designers, creative directors, brand strategists, and copywriters.',
    previewThumbnail: '/templates/creative-professional.png',
    colorScheme: { primary: '#7c3aed', secondary: '#ec4899', background: '#ffffff', text: '#1e293b' },
    features: ['Sidebar layout', 'Modern accent gradient', 'Portfolio link integration'],
  },
  {
    id: 'compact-one-page',
    name: 'Compact One-Page',
    category: 'Compact',
    description: 'Dense grid system engineered to pack comprehensive career history into exactly one high-impact sheet.',
    layout: 'header-compact',
    recommendedFor: 'Professionals wanting a guaranteed 1-page resume without cutting achievements.',
    previewThumbnail: '/templates/compact-one-page.png',
    colorScheme: { primary: '#0f172a', secondary: '#2563eb', background: '#ffffff', text: '#1e293b' },
    features: ['High density', 'Compact padding', 'Space-efficient two-column split'],
  },
  {
    id: 'two-column-professional',
    name: 'Two-Column Professional',
    category: 'Modern',
    description: 'Clean split with experience taking the main width and skills/credentials in a balanced right sidebar.',
    layout: 'sidebar-right',
    recommendedFor: 'Engineers, project managers, and product leads with extensive toolkits.',
    previewThumbnail: '/templates/two-column-professional.png',
    colorScheme: { primary: '#0d9488', secondary: '#14b8a6', background: '#ffffff', text: '#1e293b' },
    features: ['Sidebar layout', 'Visual skill strength meters', 'Contact icon pill headers'],
  },
  {
    id: 'traditional-business',
    name: 'Traditional Business',
    category: 'ATS Friendly',
    description: 'Time-tested classic layout suited for law, accounting, government, and banking institutions.',
    layout: 'single-column',
    recommendedFor: 'Finance, legal, banking, civil services, and auditing professionals.',
    previewThumbnail: '/templates/traditional-business.png',
    colorScheme: { primary: '#111827', secondary: '#4b5563', background: '#ffffff', text: '#111827' },
    features: ['Times-compatible styling', 'Centered classic header', 'Full-width rule dividers'],
  },
  {
    id: 'international-professional',
    name: 'International Professional',
    category: 'Modern',
    description: 'Accommodates multi-lingual proficiencies, international visa status, and global phone formats.',
    layout: 'two-column',
    recommendedFor: 'Global remote workers, expats, and cross-border consultants.',
    previewThumbnail: '/templates/international-professional.png',
    colorScheme: { primary: '#b45309', secondary: '#d97706', background: '#ffffff', text: '#1e293b' },
    features: ['Language proficiency levels', 'International address formats', 'Flexible contact headers'],
  },
  {
    id: 'elegant-contemporary',
    name: 'Elegant Contemporary',
    category: 'Creative',
    description: 'Editorial-grade typography with soft neutral accents, perfect for architecture and premium brands.',
    layout: 'sidebar-left',
    recommendedFor: 'Architects, interior designers, journalists, and agency leaders.',
    previewThumbnail: '/templates/elegant-contemporary.png',
    colorScheme: { primary: '#44403c', secondary: '#a8a29e', background: '#ffffff', text: '#292524' },
    features: ['Editorial styling', 'Serif display font', 'Refined badge treatment'],
  },
];

router.get('/', (_req, res) => {
  res.json({
    success: true,
    count: TEMPLATES.length,
    templates: TEMPLATES,
  });
});

export default router;

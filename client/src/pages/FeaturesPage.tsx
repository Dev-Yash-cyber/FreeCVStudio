import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.js';
import { Footer } from '../components/layout/Footer.js';
import {
  FileText,
  Sliders,
  Sparkles,
  Download,
  Shield,
  Zap,
  Kanban,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Layout,
  Layers,
  Wrench,
  Search,
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  const featureList = [
    {
      icon: Layout,
      title: '3-Panel Productivity Studio',
      description:
        'Seamless three-panel workflow: section reordering on the left, ergonomic form editing in the center, and live real-time document preview on the right.',
    },
    {
      icon: Layers,
      title: '15 Original Distinct Templates',
      description:
        'Genuinely distinct layouts engineered for every career path: single column ATS, executive serif, technical developer stacks, academic scholar formats, and compact 1-pagers.',
    },
    {
      icon: Download,
      title: 'Watermark-Free Exports',
      description:
        'Export true vector PDFs and editable Microsoft Word (.docx) documents. No watermarks, no trial periods, and no artificial download limits.',
    },
    {
      icon: Zap,
      title: 'Explainable ATS Scanner',
      description:
        'Analyze your resume against recruiting algorithms. Get instant feedback on power action verbs, quantifiable metrics, section headings, and missing job keywords.',
    },
    {
      icon: Sparkles,
      title: 'Intelligent AI Writing Assistant',
      description:
        'Rewrite weak bullet points into high-impact accomplishments, generate elevator pitch summaries, and extract keywords from target job postings.',
    },
    {
      icon: Kanban,
      title: 'Job Application Tracker',
      description:
        'A full Kanban job search board. Track stages from Wishlist to Applied, Screening, Technical Interview, and Offer with salary ranges and follow-up reminders.',
    },
    {
      icon: Wrench,
      title: 'Career Tool Suite',
      description:
        'Equipped with STAR interview worksheet builders, categorized action verb dictionaries, interview question simulators, and reusable achievement libraries.',
    },
    {
      icon: RefreshCw,
      title: 'PDF & Word Resume Importer',
      description:
        'Upload your existing PDF or DOCX resume to automatically parse contact info, work history, degrees, and skills into structured sections.',
    },
    {
      icon: Shield,
      title: 'Full Data Ownership & Privacy',
      description:
        'Your data is private. Download your complete user history in standard JSON format anytime, or permanently purge your account with one click.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <section className="py-16 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block mb-2">
            Free Platform Capabilities
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight max-w-3xl mx-auto">
            Everything you need for your career search, without the paywalls.
          </h1>
          <p className="mt-4 text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            FreeCV Studio eliminates artificial premium locks. Every feature below is available to all users free of charge.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
            >
              <span>Start Building Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Grid of features */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureList.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">{f.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
};

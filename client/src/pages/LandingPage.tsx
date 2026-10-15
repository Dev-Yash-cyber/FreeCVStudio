import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.js';
import { Footer } from '../components/layout/Footer.js';
import { useAuthStore } from '../store/useAuthStore.js';
import {
  FileText,
  Sparkles,
  Shield,
  Download,
  CheckCircle2,
  ChevronRight,
  Kanban,
  Zap,
  ArrowRight,
  Eye,
  Sliders,
  Play,
  HelpCircle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { demoLogin } = useAuthStore();
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleDemo = async () => {
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  const faqs = [
    {
      q: 'Is FreeCV Studio genuinely 100% free with no hidden charges?',
      a: 'Yes, completely. There are no subscriptions, no premium tiers, no watermarks on downloaded PDFs, and no download credit limits. All 15 templates, cover letter tools, and export formats are freely accessible to every user.',
    },
    {
      q: 'Will my downloaded resume have watermarks or branding?',
      a: 'Never. Every PDF and DOCX document exported from FreeCV Studio is clean, vector-rendered, selectable, and 100% watermark-free.',
    },
    {
      q: 'How does the ATS Scanner work?',
      a: 'Our explainable ATS analyzer runs automated structural and heuristic checks: parsing contact details, calculating quantifiable achievement metrics, measuring action verb density, and scanning for missing keywords against your target job descriptions.',
    },
    {
      q: 'Can I import my existing PDF or Word resume?',
      a: 'Yes! Simply upload your PDF or DOCX file. FreeCV Studio parses contact details, work history, education, and skills into editable sections that you can review and style.',
    },
    {
      q: 'How do you protect my privacy and document data?',
      a: 'You own your data completely. We never sell your personal information. You can export all your documents as JSON at any time or permanently delete your account with one click.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-blue-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100/80 text-blue-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-blue-200 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Zero Paywalls • Zero Watermarks • Unlimited PDF & DOCX Exports
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Build interview-winning resumes.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Every single feature is free.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Craft ATS-optimized resumes and cover letters with live 3-panel preview, intelligent AI writing assistance, multi-page pagination, and 15 distinct layout templates. No credit card required.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 group"
            >
              <span>Build My Free Resume</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>

            <button
              type="button"
              onClick={handleDemo}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-slate-200 shadow-sm transition flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              <span>Explore Instant Demo Mode</span>
            </button>
          </div>

          {/* Social Proof / Guarantee stats */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 15 Original Layout Templates
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Watermark-Free PDF & DOCX
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Explainable ATS Scoring Engine
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Kanban Job Search Tracker
            </div>
          </div>
        </div>

        {/* Hero Interactive Mockup Preview */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-slate-900 p-2 sm:p-3 rounded-2xl shadow-2xl border border-slate-800">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="font-mono ml-2 text-[11px] text-slate-300">FreeCV Studio — Live 3-Panel Editor</span>
              <div className="ml-auto flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded">
                  Autosaved
                </span>
                <span className="bg-blue-600 text-white font-semibold text-[11px] px-2.5 py-0.5 rounded">
                  Download PDF
                </span>
              </div>
            </div>
            <div className="bg-slate-100 p-4 sm:p-6 rounded-b-xl flex justify-center">
              <div className="bg-white text-slate-900 shadow-md p-6 rounded-lg max-w-2xl w-full border border-slate-200 text-left">
                <div className="border-b-2 border-blue-600 pb-2 mb-3">
                  <h3 className="font-bold text-lg text-slate-900">Alex Morgan</h3>
                  <p className="text-xs font-semibold text-blue-600">Senior Full Stack Software Engineer</p>
                  <p className="text-[10px] text-slate-500 mt-1">San Francisco, CA • alex.morgan@example.com • linkedin.com/in/alexmorgan</p>
                </div>
                <div className="space-y-3 text-xs">
                  <div>
                    <h4 className="font-bold uppercase tracking-wider text-[11px] text-slate-900 border-b pb-0.5 mb-1">
                      Professional Experience
                    </h4>
                    <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                      <span>Senior Full Stack Engineer — Vanguard Cloud Technologies</span>
                      <span className="text-slate-500 font-normal">2022 – Present</span>
                    </div>
                    <ul className="list-disc ml-4 text-slate-600 space-y-0.5 mt-0.5 text-[11px]">
                      <li>Architected high-throughput analytics platform handling 350,000 daily active users with 99.99% uptime.</li>
                      <li>Reduced API latency by 42% via Redis caching, async messaging queues, and database indexing.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Complete Career Suite</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything required to land your next high-impact role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">15 Original Layout Templates</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                From 100% ATS-compliant single column formats to modern tech badge layouts, academic scholar profiles, and executive styles.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Explainable ATS Scanner</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive instant actionable feedback on action verbs, quantifiable achievements, and compare your resume directly against target job descriptions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                <Kanban className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Job Application Kanban</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track every stage of your job hunt from wishlist to interview prep, follow-up reminders, salary negotiation, and final offers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">Transparency & FAQ</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm text-slate-900 flex justify-between items-center hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      activeFaq === idx ? 'rotate-90 text-blue-600' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

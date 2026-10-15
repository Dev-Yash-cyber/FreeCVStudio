import React from 'react';
import { Navbar } from '../components/layout/Navbar.js';
import { Footer } from '../components/layout/Footer.js';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <div className="max-w-4xl w-full mx-auto px-4 py-16">
        <div className="bg-white p-8 md:p-12 rounded-2xl border shadow-sm space-y-6">
          <div className="border-b pb-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" /> Legal Terms
            </div>
            <h1 className="text-3xl font-black text-slate-900">Terms of Service</h1>
            <p className="text-xs text-slate-500 mt-1">Effective Date: October 14, 2026</p>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <h2 className="text-sm font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using FreeCV Studio, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
            </p>

            <h2 className="text-sm font-bold text-slate-900">2. Free Access Policy</h2>
            <p>
              FreeCV Studio is committed to providing 100% of its native application features free of charge. Users are never subjected to subscription paywalls, watermarked PDF downloads, or artificial version creation locks.
            </p>

            <h2 className="text-sm font-bold text-slate-900">3. User Responsibility & Accurate Information</h2>
            <p>
              Users are responsible for ensuring that all professional background, employment records, degrees, and certifications entered into their resumes and cover letters are accurate, truthful, and representative of their authentic qualifications. FreeCV Studio does not fabricate or guarantee employment outcomes.
            </p>

            <h2 className="text-sm font-bold text-slate-900">4. Intellectual Property</h2>
            <p>
              You retain all ownership, copyright, and title to the text, images, and content you produce in your documents. FreeCV Studio grants you a perpetual, royalty-free license to use, download, print, and distribute documents formatted using our original templates.
            </p>

            <h2 className="text-sm font-bold text-slate-900">5. Limitation of Liability</h2>
            <p>
              FreeCV Studio provides its tools on an "as is" and "as available" basis without warranties of any kind. We do not guarantee interview invitations or specific employment results from third-party employers.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

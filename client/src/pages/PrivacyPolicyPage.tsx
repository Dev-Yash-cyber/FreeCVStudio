import React from 'react';
import { Navbar } from '../components/layout/Navbar.js';
import { Footer } from '../components/layout/Footer.js';
import { Shield } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <div className="max-w-4xl w-full mx-auto px-4 py-16">
        <div className="bg-white p-8 md:p-12 rounded-2xl border shadow-sm space-y-6">
          <div className="border-b pb-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4" /> Legal & Privacy
            </div>
            <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-500 mt-1">Effective Date: October 14, 2026</p>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <h2 className="text-sm font-bold text-slate-900">1. Our Commitment to Your Privacy</h2>
            <p>
              FreeCV Studio is built on the principle that job seekers deserve professional, high-quality document tools without predatory monetization, hidden paywalls, or data resale. We treat your personal resume data with strict confidentiality.
            </p>

            <h2 className="text-sm font-bold text-slate-900">2. Data We Collect</h2>
            <p>
              We collect only the information necessary to provide the resume builder service: your account name, email address, password hash, and the resume/cover letter content you author in our editor.
            </p>

            <h2 className="text-sm font-bold text-slate-900">3. How Your Data Is Stored & Protected</h2>
            <p>
              All resume data is securely persisted in authenticated, encrypted MongoDB database clusters with access controls. We do not sell, rent, or trade your personal contact details to recruiters, advertisers, or third-party brokers.
            </p>

            <h2 className="text-sm font-bold text-slate-900">4. AI Writing Assistant & External Providers</h2>
            <p>
              FreeCV Studio provides an intelligent built-in rule-based NLP assistant that processes writing suggestions with zero external transmission. If external AI API keys are configured, data is processed solely for generating real-time suggestions and is not stored for model training.
            </p>

            <h2 className="text-sm font-bold text-slate-900">5. Your Rights: Export & Deletion</h2>
            <p>
              Under GDPR and international data protection laws, you retain full ownership of your records. You may export your entire account history as JSON at any time or permanently delete your account and all associated documents from our settings page.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

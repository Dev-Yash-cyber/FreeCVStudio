import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-extrabold text-base tracking-tight">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              FreeCV Studio
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              The professional resume and cover letter studio with zero paywalls, zero watermarks, and unlimited document exports.
            </p>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              100% Free Forever Guarantee
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Features</h4>
            <ul className="space-y-1.5">
              <li><Link to="/features" className="hover:text-white transition">Resume Builder</Link></li>
              <li><Link to="/templates" className="hover:text-white transition">15 Original Templates</Link></li>
              <li><Link to="/cover-letters" className="hover:text-white transition">Cover Letter Builder</Link></li>
              <li><Link to="/applications" className="hover:text-white transition">Job Application Kanban</Link></li>
            </ul>
          </div>

          {/* Career Tools */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Career Suite</h4>
            <ul className="space-y-1.5">
              <li><Link to="/career-tools" className="hover:text-white transition">ATS Scanner & Analyzer</Link></li>
              <li><Link to="/career-tools" className="hover:text-white transition">STAR Interview Worksheet</Link></li>
              <li><Link to="/career-tools" className="hover:text-white transition">Power Verbs Dictionary</Link></li>
              <li><Link to="/career-tools" className="hover:text-white transition">Interview Question Prep</Link></li>
            </ul>
          </div>

          {/* Privacy & Legal */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Trust & Privacy</h4>
            <ul className="space-y-1.5">
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/settings/privacy" className="hover:text-white transition">GDPR Data Export</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} FreeCV Studio. All application features are completely free.
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Engineered with precision for job seekers worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

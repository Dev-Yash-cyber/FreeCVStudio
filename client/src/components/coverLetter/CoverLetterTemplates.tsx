import React from 'react';
import { CoverLetterData } from '../../types/index.js';

interface CoverLetterTemplateProps {
  data: CoverLetterData;
  design?: {
    templateId?: string;
    accentColor?: string;
    fontFamily?: string;
    fontSize?: number;
    lineSpacing?: number;
  };
}

// 1. Modern Minimal Template
export const ModernMinimalTemplate: React.FC<CoverLetterTemplateProps> = ({ data, design = {} }) => {
  const accent = design.accentColor || '#2563eb';

  return (
    <div className="w-full space-y-6 text-slate-800 text-xs leading-relaxed font-sans">
      {/* Header with accent bar */}
      <div className="border-b-2 pb-4" style={{ borderColor: accent }}>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{data.senderName || 'Your Name'}</h1>
        <p className="font-semibold text-sm mt-0.5" style={{ color: accent }}>{data.senderTitle || 'Professional Title'}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-slate-500 text-[11px] mt-1.5">
          {data.senderEmail && <span>{data.senderEmail}</span>}
          {data.senderPhone && <span>• {data.senderPhone}</span>}
          {data.senderLocation && <span>• {data.senderLocation}</span>}
        </div>
      </div>

      {/* Date */}
      <div className="text-slate-400 font-medium">{data.date || 'October 15, 2026'}</div>

      {/* Recipient info */}
      <div className="space-y-0.5 text-slate-700">
        <div className="font-bold text-slate-900">{data.recipientName || 'Hiring Manager'}</div>
        {data.recipientTitle && <div className="text-slate-600">{data.recipientTitle}</div>}
        <div className="font-semibold text-slate-800">{data.companyName || 'Target Company'}</div>
        {data.companyAddress && <div className="text-slate-500">{data.companyAddress}</div>}
      </div>

      {/* Salutation */}
      <div className="font-bold text-slate-900 pt-1">{data.salutation || 'Dear Hiring Manager,'}</div>

      {/* Opening */}
      {data.openingParagraph && <p className="text-justify leading-relaxed">{data.openingParagraph}</p>}

      {/* Body Paragraphs */}
      {(data.bodyParagraphs || []).map((bp, i) => (
        <p key={i} className="text-justify leading-relaxed">{bp}</p>
      ))}

      {/* Closing */}
      {data.closingParagraph && <p className="text-justify leading-relaxed">{data.closingParagraph}</p>}

      {/* Sign-off */}
      <div className="pt-4 space-y-4">
        <div>{data.signOff || 'Sincerely,'}</div>
        <div className="font-bold text-sm text-slate-900">{data.senderName || 'Your Name'}</div>
      </div>
    </div>
  );
};

// 2. Executive Corporate Template
export const ExecutiveCorporateTemplate: React.FC<CoverLetterTemplateProps> = ({ data, design = {} }) => {
  const accent = design.accentColor || '#1e3a8a';

  return (
    <div className="w-full space-y-6 text-slate-800 text-xs leading-relaxed font-serif">
      {/* Formal Centered Letterhead */}
      <div className="text-center pb-5 border-b border-slate-300">
        <h1 className="text-2xl font-bold uppercase tracking-widest text-slate-900">{data.senderName || 'Your Name'}</h1>
        <p className="text-xs uppercase tracking-wider font-semibold mt-1" style={{ color: accent }}>
          {data.senderTitle || 'Executive'}
        </p>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-slate-500 text-[11px] mt-2">
          {data.senderEmail && <span>{data.senderEmail}</span>}
          {data.senderPhone && <span>| {data.senderPhone}</span>}
          {data.senderLocation && <span>| {data.senderLocation}</span>}
        </div>
      </div>

      <div className="flex justify-between items-baseline pt-2">
        <div className="space-y-0.5 text-slate-700">
          <div className="font-bold text-slate-900">{data.recipientName}</div>
          {data.recipientTitle && <div>{data.recipientTitle}</div>}
          <div className="font-semibold text-slate-800">{data.companyName}</div>
          {data.companyAddress && <div className="text-slate-500">{data.companyAddress}</div>}
        </div>
        <div className="text-slate-500 font-medium text-right">{data.date}</div>
      </div>

      <div className="font-bold text-slate-900 pt-2">{data.salutation}</div>

      {data.openingParagraph && <p className="text-justify leading-relaxed">{data.openingParagraph}</p>}

      {(data.bodyParagraphs || []).map((bp, i) => (
        <p key={i} className="text-justify leading-relaxed">{bp}</p>
      ))}

      {data.closingParagraph && <p className="text-justify leading-relaxed">{data.closingParagraph}</p>}

      <div className="pt-4 space-y-5">
        <div>{data.signOff}</div>
        <div className="font-bold text-sm text-slate-900">{data.senderName}</div>
      </div>
    </div>
  );
};

// 3. Creative Left Accent Template
export const CreativeAccentTemplate: React.FC<CoverLetterTemplateProps> = ({ data, design = {} }) => {
  const accent = design.accentColor || '#7c3aed';

  return (
    <div className="w-full flex gap-6 text-xs text-slate-800 font-sans leading-relaxed">
      {/* Left colored bar & sender card */}
      <div className="w-52 flex-shrink-0 border-r border-slate-200 pr-5 space-y-6">
        <div className="p-4 rounded-xl text-white shadow-sm" style={{ backgroundColor: accent }}>
          <h2 className="font-bold text-base leading-snug">{data.senderName || 'Your Name'}</h2>
          <p className="text-[11px] opacity-90 mt-0.5 font-medium">{data.senderTitle || 'Specialist'}</p>
        </div>

        <div className="space-y-3 text-[11px] text-slate-600">
          <div>
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-0.5">Contact</span>
            {data.senderEmail && <div className="truncate">{data.senderEmail}</div>}
            {data.senderPhone && <div>{data.senderPhone}</div>}
            {data.senderLocation && <div>{data.senderLocation}</div>}
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-0.5">Application To</span>
            <div className="font-semibold text-slate-900">{data.companyName}</div>
            <div className="text-slate-600">{data.jobTitle}</div>
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 block mb-0.5">Date</span>
            <div className="text-slate-500">{data.date}</div>
          </div>
        </div>
      </div>

      {/* Main Letter Body */}
      <div className="flex-1 space-y-4 pt-1">
        <div className="space-y-0.5 pb-2">
          <div className="font-bold text-slate-900">{data.recipientName}</div>
          {data.recipientTitle && <div className="text-slate-500">{data.recipientTitle}</div>}
          {data.companyAddress && <div className="text-slate-400 text-[11px]">{data.companyAddress}</div>}
        </div>

        <div className="font-bold text-slate-900">{data.salutation}</div>

        {data.openingParagraph && <p className="leading-relaxed">{data.openingParagraph}</p>}

        {(data.bodyParagraphs || []).map((bp, i) => (
          <p key={i} className="leading-relaxed">{bp}</p>
        ))}

        {data.closingParagraph && <p className="leading-relaxed">{data.closingParagraph}</p>}

        <div className="pt-4 space-y-4">
          <div>{data.signOff}</div>
          <div className="font-bold text-slate-900">{data.senderName}</div>
        </div>
      </div>
    </div>
  );
};

// 4. Classic Traditional Template
export const ClassicTraditionalTemplate: React.FC<CoverLetterTemplateProps> = ({ data, design = {} }) => {
  return (
    <div className="w-full space-y-5 text-slate-900 text-xs leading-relaxed font-serif">
      {/* Right aligned sender info */}
      <div className="text-right space-y-0.5 border-b pb-4 border-slate-300">
        <h1 className="font-bold text-lg">{data.senderName || 'Your Name'}</h1>
        <div className="text-slate-600">{data.senderTitle}</div>
        <div className="text-slate-500 text-[11px]">
          {[data.senderEmail, data.senderPhone, data.senderLocation].filter(Boolean).join(' • ')}
        </div>
      </div>

      <div className="text-right text-slate-600">{data.date}</div>

      <div className="space-y-0.5 text-slate-800">
        <div className="font-semibold">{data.recipientName}</div>
        <div>{data.recipientTitle}</div>
        <div className="font-semibold">{data.companyName}</div>
        <div>{data.companyAddress}</div>
      </div>

      <div className="font-bold pt-2">{data.salutation}</div>

      {data.openingParagraph && <p className="text-justify leading-relaxed indent-6">{data.openingParagraph}</p>}

      {(data.bodyParagraphs || []).map((bp, i) => (
        <p key={i} className="text-justify leading-relaxed indent-6">{bp}</p>
      ))}

      {data.closingParagraph && <p className="text-justify leading-relaxed indent-6">{data.closingParagraph}</p>}

      <div className="pt-4 space-y-4">
        <div>{data.signOff}</div>
        <div className="font-bold mt-4">{data.senderName}</div>
      </div>
    </div>
  );
};

// 5. Tech Contemporary Template
export const TechContemporaryTemplate: React.FC<CoverLetterTemplateProps> = ({ data, design = {} }) => {
  const accent = design.accentColor || '#0ea5e9';

  return (
    <div className="w-full space-y-5 text-slate-800 text-xs leading-relaxed font-sans">
      {/* Modern Badge Header */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl flex justify-between items-center shadow-sm">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 block mb-1">
            // APPLICATION LETTER
          </span>
          <h1 className="text-xl font-extrabold tracking-tight">{data.senderName || 'Your Name'}</h1>
          <p className="text-slate-300 text-xs mt-0.5 font-medium">{data.senderTitle || 'Engineer'}</p>
        </div>
        <div className="text-right font-mono text-[11px] text-slate-400 space-y-0.5">
          {data.senderEmail && <div>{data.senderEmail}</div>}
          {data.senderPhone && <div>{data.senderPhone}</div>}
          <div className="text-sky-300 font-semibold">{data.date}</div>
        </div>
      </div>

      {/* Recipient Details */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex justify-between items-center text-xs">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">TARGET RECIPIENT</span>
          <span className="font-bold text-slate-900">{data.recipientName}</span>
          <span className="text-slate-500"> — {data.recipientTitle}</span>
        </div>
        <div className="text-right">
          <span className="font-bold text-slate-900">{data.companyName}</span>
          {data.companyAddress && <div className="text-slate-500 text-[11px]">{data.companyAddress}</div>}
        </div>
      </div>

      <div className="font-bold text-slate-900 pt-1">{data.salutation}</div>

      {data.openingParagraph && <p className="leading-relaxed">{data.openingParagraph}</p>}

      {(data.bodyParagraphs || []).map((bp, i) => (
        <p key={i} className="leading-relaxed">{bp}</p>
      ))}

      {data.closingParagraph && <p className="leading-relaxed">{data.closingParagraph}</p>}

      <div className="pt-4 border-t border-slate-100 space-y-4">
        <div>{data.signOff}</div>
        <div className="font-bold text-sm text-slate-900">{data.senderName}</div>
      </div>
    </div>
  );
};

// Master Cover Letter Renderer
export const CoverLetterDocument: React.FC<CoverLetterTemplateProps> = ({ data, design = {} }) => {
  const templateId = design.templateId || 'modern-minimal';

  switch (templateId) {
    case 'executive-corporate':
      return <ExecutiveCorporateTemplate data={data} design={design} />;
    case 'creative-accent':
      return <CreativeAccentTemplate data={data} design={design} />;
    case 'classic-traditional':
      return <ClassicTraditionalTemplate data={data} design={design} />;
    case 'tech-contemporary':
      return <TechContemporaryTemplate data={data} design={design} />;
    case 'modern-minimal':
    default:
      return <ModernMinimalTemplate data={data} design={design} />;
  }
};

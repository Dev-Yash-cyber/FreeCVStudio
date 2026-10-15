import React from 'react';
import { ResumeData, DesignSettings } from '../../types/index.js';

// Import the 15 distinct layout templates
import { AtsProfessionalTemplate } from './AtsProfessionalTemplate.js';
import { MinimalCleanTemplate } from './MinimalCleanTemplate.js';
import { ModernCorporateTemplate } from './ModernCorporateTemplate.js';
import { ExecutiveTemplate } from './ExecutiveTemplate.js';
import { SoftwareDeveloperTemplate } from './SoftwareDeveloperTemplate.js';
import { TechnologyProfessionalTemplate } from './TechnologyProfessionalTemplate.js';
import { StudentFresherTemplate } from './StudentFresherTemplate.js';
import { GraduateTemplate } from './GraduateTemplate.js';
import { AcademicResearchTemplate } from './AcademicResearchTemplate.js';
import { CreativeProfessionalTemplate } from './CreativeProfessionalTemplate.js';
import { CompactOnePageTemplate } from './CompactOnePageTemplate.js';
import { TwoColumnProfessionalTemplate } from './TwoColumnProfessionalTemplate.js';
import { TraditionalBusinessTemplate } from './TraditionalBusinessTemplate.js';
import { InternationalProfessionalTemplate } from './InternationalProfessionalTemplate.js';
import { ElegantContemporaryTemplate } from './ElegantContemporaryTemplate.js';

interface ResumeDocumentProps {
  data: ResumeData;
  design: DesignSettings;
  className?: string;
  zoom?: number;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({
  data,
  design,
  className = '',
  zoom = 100,
}) => {
  const isLetter = design.paperSize === 'Letter';
  const widthMm = isLetter ? 215.9 : 210;
  const minHeightMm = isLetter ? 279.4 : 297;

  // Select layout by templateId
  const renderTemplate = () => {
    switch (design.templateId) {
      case 'minimal-clean':
        return <MinimalCleanTemplate data={data} design={design} />;
      case 'modern-corporate':
        return <ModernCorporateTemplate data={data} design={design} />;
      case 'executive':
        return <ExecutiveTemplate data={data} design={design} />;
      case 'software-developer':
        return <SoftwareDeveloperTemplate data={data} design={design} />;
      case 'technology-professional':
        return <TechnologyProfessionalTemplate data={data} design={design} />;
      case 'student-fresher':
        return <StudentFresherTemplate data={data} design={design} />;
      case 'graduate':
        return <GraduateTemplate data={data} design={design} />;
      case 'academic-research':
        return <AcademicResearchTemplate data={data} design={design} />;
      case 'creative-professional':
        return <CreativeProfessionalTemplate data={data} design={design} />;
      case 'compact-one-page':
        return <CompactOnePageTemplate data={data} design={design} />;
      case 'two-column-professional':
        return <TwoColumnProfessionalTemplate data={data} design={design} />;
      case 'traditional-business':
        return <TraditionalBusinessTemplate data={data} design={design} />;
      case 'international-professional':
        return <InternationalProfessionalTemplate data={data} design={design} />;
      case 'elegant-contemporary':
        return <ElegantContemporaryTemplate data={data} design={design} />;
      case 'ats-professional':
      default:
        return <AtsProfessionalTemplate data={data} design={design} />;
    }
  };

  const getBulletListStyle = () => {
    switch (design.bulletStyle) {
      case 'dash':
        return `list-style-type: "- ";`;
      case 'arrow':
        return `list-style-type: "▸ ";`;
      case 'diamond':
        return `list-style-type: "◆ ";`;
      case 'check':
        return `list-style-type: "✓ ";`;
      case 'square':
        return `list-style-type: square;`;
      case 'circle':
        return `list-style-type: circle;`;
      case 'disc':
      default:
        return `list-style-type: disc;`;
    }
  };

  const getLinkColor = () => {
    if (design.linkColor === 'text') return design.textColor || '#1e293b';
    if (design.linkColor === 'muted') return design.secondaryColor || '#64748b';
    return design.accentColor || '#2563eb';
  };

  return (
    <div
      style={{
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top center',
        transition: 'transform 0.15s ease-out',
      }}
      className={`flex justify-center transition-all ${className}`}
    >
      <div
        id="resume-printable-document"
        className="resume-page bg-white text-slate-800 shadow-2xl relative select-text transition-all print:shadow-none print:m-0 flex flex-col justify-between"
        style={{
          width: `${widthMm}mm`,
          minHeight: `${minHeightMm}mm`,
          padding: `${design.margins || 24}px`,
          fontFamily: `'${design.fontFamily || 'Inter'}', sans-serif`,
          fontSize: `${design.fontSize || 11}px`,
          lineHeight: design.lineSpacing || 1.4,
          backgroundColor: design.backgroundColor || '#ffffff',
          color: design.textColor || '#1e293b',
        }}
      >
        {/* Dynamic Scoped CSS for entries, bullets, links, and headings */}
        <style>{`
          #resume-printable-document ul {
            ${getBulletListStyle()}
          }
          #resume-printable-document li {
            padding-left: 2px;
          }
          #resume-printable-document a {
            text-decoration: ${design.linkUnderline ? 'underline' : 'none'};
            color: ${getLinkColor()};
          }
          #resume-printable-document h2 {
            font-weight: ${design.headingWeight || '600'};
            letter-spacing: ${
              design.headingTracking === 'wide'
                ? '0.05em'
                : design.headingTracking === 'wider'
                ? '0.1em'
                : 'normal'
            };
          }
        `}</style>

        {/* Render Template Body */}
        <div className="flex-1 w-full">
          {renderTemplate()}
        </div>

        {/* Footer Block (Page numbers & Custom footer disclaimer) */}
        {(design.showPageNumbers || design.footerText) && (
          <footer
            className={`mt-6 pt-2 text-[10px] text-slate-400 flex items-center justify-between no-print-optional ${
              design.showFooterDivider ? 'border-t border-slate-200' : ''
            }`}
          >
            <span className="truncate max-w-[70%]">{design.footerText || ''}</span>
            {design.showPageNumbers && (
              <span
                className={`font-mono text-slate-400 ${
                  design.pageNumberPosition === 'left'
                    ? 'order-first'
                    : design.pageNumberPosition === 'center'
                    ? 'mx-auto'
                    : 'ml-auto'
                }`}
              >
                {design.pageNumberFormat || 'Page 1 of 1'}
              </span>
            )}
          </footer>
        )}
      </div>
    </div>
  );
};

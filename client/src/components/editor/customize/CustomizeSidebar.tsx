import React from 'react';

export type CustomizeTab =
  | 'document'
  | 'templates'
  | 'layout'
  | 'fontSize'
  | 'spacing'
  | 'entries'
  | 'headings'
  | 'font'
  | 'colors'
  | 'header'
  | 'photo'
  | 'links'
  | 'footer'
  | 'sections';

interface CustomizeSidebarProps {
  activeTab: CustomizeTab;
  onSelectTab: (tab: CustomizeTab) => void;
}

export const CUSTOMIZE_TABS: { id: CustomizeTab; label: string }[] = [
  { id: 'document', label: 'Document' },
  { id: 'templates', label: 'Templates' },
  { id: 'layout', label: 'Layout' },
  { id: 'fontSize', label: 'Font Size' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'entries', label: 'Entries' },
  { id: 'headings', label: 'Headings' },
  { id: 'font', label: 'Font' },
  { id: 'colors', label: 'Colors' },
  { id: 'header', label: 'Header' },
  { id: 'photo', label: 'Photo' },
  { id: 'links', label: 'Links' },
  { id: 'footer', label: 'Footer' },
  { id: 'sections', label: 'Sections' },
];

export const CustomizeSidebar: React.FC<CustomizeSidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="w-full h-full bg-[#f8f8f7] py-3 flex flex-col justify-between select-none">
      <nav className="flex flex-col space-y-0.5">
        {CUSTOMIZE_TABS.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`group relative flex items-center w-full px-5 py-2.5 text-left text-[14px] font-medium transition-colors ${
                isActive
                  ? 'text-[#7c3aed] font-semibold bg-white/70'
                  : 'text-[#64748b] hover:text-[#1e293b] hover:bg-black/[0.02]'
              }`}
            >
              {/* Left Accent Indicator matching FlowCV */}
              <span
                className={`absolute left-0 top-0 bottom-0 w-[3px] transition-all ${
                  isActive
                    ? 'bg-[#7c3aed] opacity-100'
                    : 'bg-slate-400 opacity-0 group-hover:opacity-60'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Subtle indicator hint */}
      <div className="px-5 pt-3 border-t border-slate-200/60 text-[11px] text-slate-400">
        FlowCV Design Engine
      </div>
    </div>
  );
};

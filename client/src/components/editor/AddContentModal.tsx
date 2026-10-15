import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  FileBadge,
  Heart,
  FolderGit2,
  BookOpen,
  Trophy,
  Building2,
  BookText,
  UserCheck,
  PenTool,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';

export interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSection: (sectionKey: string) => void;
  activeSections?: string[];
}

export const AddContentModal: React.FC<AddContentModalProps> = ({
  isOpen,
  onClose,
  onSelectSection,
  activeSections = [],
}) => {
  if (!isOpen) return null;

  const contentItems = [
    {
      id: 'education',
      title: 'Education',
      description: 'Add your degrees and schools. Include your focus, honors, or exchange terms.',
      icon: GraduationCap,
    },
    {
      id: 'experience',
      title: 'Work Experience/Intern',
      description: 'Add your professional roles and employer history including internships.',
      icon: Briefcase,
    },
    {
      id: 'skills',
      title: 'Skills',
      description: 'Add your hard and soft skills that help you stand out from the crowd today.',
      icon: Award,
    },
    {
      id: 'languages',
      title: 'Languages',
      description: 'Add your languages and proficiency level to show your communication range.',
      icon: Globe,
    },
    {
      id: 'certificates',
      title: 'Certificates',
      description: 'Add your industry certificates or licences. Include issuer and date earned.',
      icon: FileBadge,
    },
    {
      id: 'interests',
      title: 'Interests',
      description: 'Add relevant personal interests that support your career story and cultural fit.',
      icon: Heart,
    },
    {
      id: 'projects',
      title: 'Projects',
      description: 'Add key projects you participated in and highlight your challenges, role, and impact.',
      icon: FolderGit2,
    },
    {
      id: 'courses',
      title: 'Courses',
      description: 'Add online or in-person courses and trainings you joined and completed.',
      icon: BookOpen,
    },
    {
      id: 'awards',
      title: 'Awards',
      description: 'Add your awards and recognitions from industry, competitions, or academia.',
      icon: Trophy,
    },
    {
      id: 'organizations',
      title: 'Organizations',
      description: 'Add your memberships or volunteering with organisations including your role.',
      icon: Building2,
    },
    {
      id: 'publications',
      title: 'Publications',
      description: 'Add publications, articles, or books you wrote or contributed to.',
      icon: BookText,
    },
    {
      id: 'references',
      title: 'References',
      description: 'Add your references from managers or coworkers, including their contact details.',
      icon: UserCheck,
    },
    {
      id: 'declaration',
      title: 'Declaration',
      description: 'Add your declaration by creating or uploading your personal signature.',
      icon: PenTool,
    },
    {
      id: 'custom',
      title: 'Custom',
      description: 'Add a custom section for anything else, or combine sections cleanly.',
      icon: Plus,
      isCustom: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 md:p-8 shadow-2xl relative border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Add content</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select any section to add or customize in your resume. All sections are 100% free with unlimited entries.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Tiles Grid */}
        <div className="flex-1 overflow-y-auto py-6 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {contentItems.map((item) => {
              const Icon = item.icon;
              const isPresent = activeSections.includes(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectSection(item.id);
                    onClose();
                  }}
                  className={`text-left p-4 rounded-2xl transition-all duration-200 group flex flex-col justify-between relative ${
                    item.isCustom
                      ? 'border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/20'
                      : 'border border-slate-200/90 hover:border-blue-400 hover:shadow-md bg-white hover:bg-blue-50/10'
                  }`}
                >
                  {isPresent && (
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 flex items-center justify-center transition">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-slate-500 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Footer Tip */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <span>Tip: You can reorder or hide sections anytime from the sidebar.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

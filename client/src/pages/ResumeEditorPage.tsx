import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore.js';
import { api } from '../services/api.js';

// Section Form Editors
import { PersonalInfoForm } from '../components/editor/PersonalInfoForm.js';
import { ExperienceForm } from '../components/editor/ExperienceForm.js';
import { EducationForm } from '../components/editor/EducationForm.js';
import { SkillsForm } from '../components/editor/SkillsForm.js';
import { ProjectsForm } from '../components/editor/ProjectsForm.js';
import { AdditionalSectionsForm } from '../components/editor/AdditionalSectionsForm.js';

// Modals & Drawers
import { DesignSettingsDrawer } from '../components/editor/DesignSettingsDrawer.js';
import { AtsAnalyzerModal } from '../components/editor/AtsAnalyzerModal.js';
import { VersionHistoryDrawer } from '../components/editor/VersionHistoryDrawer.js';
import { ImportResumeModal } from '../components/editor/ImportResumeModal.js';
import { ExportDropdown } from '../components/editor/ExportDropdown.js';
import { ResumeDocument } from '../components/templates/ResumeDocument.js';
import { AddContentModal } from '../components/editor/AddContentModal.js';
import { AiToolsPanel } from '../components/editor/AiToolsPanel.js';

// Customize System
import { CustomizeSidebar, CustomizeTab } from '../components/editor/customize/CustomizeSidebar.js';
import { CustomizePanel } from '../components/editor/customize/CustomizePanel.js';

// Icons
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
  Bookmark,
  Sliders,
  Zap,
  History,
  UploadCloud,
  Undo2,
  Redo2,
  Save,
  CheckCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  PenTool,
  Palette,
  Plus,
  Target,
} from 'lucide-react';

export const ResumeEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    resume,
    setResume,
    activeSection,
    setActiveSection,
    isSaving,
    isDirty,
    lastSaved,
    undo,
    redo,
    historyIndex,
    history,
    saveResume,
    updateTitle,
    toggleSectionVisibility,
    zoomLevel,
    setZoomLevel,
    updateCustomSections,
    updateCertifications,
    updateAwards,
    updateVolunteering,
    updatePublications,
    updateReferences,
    updateInterests,
    updateSkills,
  } = useResumeStore();

  const [loading, setLoading] = useState(true);
  const [editorMode, setEditorMode] = useState<'content' | 'customize' | 'ai'>('content');
  const [customizeTab, setCustomizeTab] = useState<CustomizeTab>('document');
  const [designOpen, setDesignOpen] = useState(false);
  const [atsOpen, setAtsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [addContentOpen, setAddContentOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id]);

  const loadResume = async (resumeId: string) => {
    try {
      const res = await api.getResume(resumeId);
      setResume(res.resume);
    } catch (e) {
      console.error(e);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'personalInfo', label: 'Personal Details', icon: User },
    { id: 'experience', label: 'Work Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills & Tech', icon: Award },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'additional', label: 'Certs & Awards', icon: Bookmark },
  ];

  if (loading || !resume) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
        Loading FreeCV Editor...
      </div>
    );
  }

  const hidden = new Set(resume.data?.hiddenSections || []);

  const handleAddOrActivateSection = (sectionId: string) => {
    if (!resume) return;

    // Unhide if in hiddenSections
    if (resume.data?.hiddenSections?.includes(sectionId)) {
      toggleSectionVisibility(sectionId);
    }

    switch (sectionId) {
      case 'education':
        setActiveSection('education');
        setEditorMode('content');
        break;
      case 'experience':
        setActiveSection('experience');
        setEditorMode('content');
        break;
      case 'skills':
        setActiveSection('skills');
        setEditorMode('content');
        break;
      case 'projects':
        setActiveSection('projects');
        setEditorMode('content');
        break;
      case 'languages': {
        const categories = [...(resume.data?.skillCategories || [])];
        if (!categories.some((c) => c.categoryName.toLowerCase().includes('lang'))) {
          categories.push({
            id: 'cat-lang-' + Date.now(),
            categoryName: 'Languages',
            skills: [
              { name: 'English (Fluent)' },
              { name: 'Spanish (Intermediate)' },
            ],
          });
          updateSkills(categories);
        }
        setActiveSection('skills');
        setEditorMode('content');
        break;
      }
      case 'courses': {
        const custom = [...(resume.data?.customSections || [])];
        if (!custom.some((c) => c.sectionTitle.toLowerCase().includes('course'))) {
          custom.push({
            id: 'sec-courses-' + Date.now(),
            sectionTitle: 'Courses & Trainings',
            items: [
              {
                id: 'course-' + Date.now(),
                title: 'Full Stack Cloud Architecture',
                subtitle: 'Coursera / Stanford Online',
                date: '2024',
                bulletPoints: ['Comprehensive coverage of microservices, serverless, and cloud deployments.'],
              },
            ],
          });
          updateCustomSections(custom);
        }
        setActiveSection('additional');
        setEditorMode('content');
        break;
      }
      case 'declaration': {
        const custom = [...(resume.data?.customSections || [])];
        if (!custom.some((c) => c.sectionTitle.toLowerCase().includes('declaration'))) {
          custom.push({
            id: 'sec-decl-' + Date.now(),
            sectionTitle: 'Declaration',
            items: [
              {
                id: 'decl-' + Date.now(),
                title: 'Declaration Statement',
                description: 'I hereby declare that the details furnished above are true and correct to the best of my knowledge and belief.',
                bulletPoints: [],
              },
            ],
          });
          updateCustomSections(custom);
        }
        setActiveSection('additional');
        setEditorMode('content');
        break;
      }
      case 'custom': {
        const custom = [...(resume.data?.customSections || [])];
        custom.push({
          id: 'sec-custom-' + Date.now(),
          sectionTitle: 'Custom Section',
          items: [
            {
              id: 'custom-' + Date.now(),
              title: 'Activity / Leadership Title',
              subtitle: 'Organization / Institution',
              date: '2024',
              description: 'Summary of contributions, leadership, and accomplishments.',
              bulletPoints: [],
            },
          ],
        });
        updateCustomSections(custom);
        setActiveSection('additional');
        setEditorMode('content');
        break;
      }
      case 'certificates': {
        if (!resume.data?.certifications || resume.data.certifications.length === 0) {
          updateCertifications([
            {
              id: 'cert-' + Date.now(),
              name: 'AWS Certified Solutions Architect',
              issuer: 'Amazon Web Services',
              issueDate: '2024',
            },
          ]);
        }
        setActiveSection('additional');
        setEditorMode('content');
        break;
      }
      case 'awards': {
        if (!resume.data?.awards || resume.data.awards.length === 0) {
          updateAwards([
            {
              id: 'award-' + Date.now(),
              title: 'Engineering Excellence Award',
              issuer: 'Vanguard Technologies',
              date: '2023',
            },
          ]);
        }
        setActiveSection('additional');
        setEditorMode('content');
        break;
      }
      case 'organizations': {
        if (!resume.data?.volunteering || resume.data.volunteering.length === 0) {
          updateVolunteering([
            {
              id: 'vol-' + Date.now(),
              organization: 'Community Outreach',
              role: 'Volunteer Mentor',
              startDate: '2023',
              endDate: 'Present',
              isCurrent: true,
              bulletPoints: ['Mentored aspiring software developers and guided community tech initiatives.'],
            },
          ]);
        }
        setActiveSection('additional');
        setEditorMode('content');
        break;
      }
      case 'publications': {
        if (!resume.data?.publications || resume.data.publications.length === 0) {
          updatePublications([
            {
              id: 'pub-' + Date.now(),
              title: 'Modern Web Architecture & Performance',
              publisher: 'IEEE / Tech Journal',
              date: '2023',
              description: 'Research analysis on latency reduction in distributed microservices.',
            },
          ]);
        }
        setActiveSection('additional');
        setEditorMode('content');
        break;
      }
      case 'references': {
        if (!resume.data?.references || resume.data.references.length === 0) {
          updateReferences([
            {
              id: 'ref-' + Date.now(),
              name: 'Available upon request',
              title: 'Professional References',
              company: 'Verified Contact List',
              email: 'references@example.com',
            },
          ]);
        }
        setActiveSection('additional');
        setEditorMode('content');
        break;
      }
      case 'interests': {
        if (!resume.data?.interests || resume.data.interests.length === 0) {
          updateInterests(['Open Source Software', 'System Design', 'Marathon Running', 'Chess']);
        }
        setActiveSection('additional');
        setEditorMode('content');
        break;
      }
      default:
        setActiveSection('additional');
        setEditorMode('content');
        break;
    }
  };

  const activeSectionsList = [
    'education',
    'experience',
    'skills',
    'projects',
    'additional',
    ...(resume.data?.customSections?.map((s) => s.id) || []),
  ];

  const renderActiveSectionForm = () => {
    switch (activeSection) {
      case 'experience':
        return <ExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'additional':
        return <AdditionalSectionsForm />;
      case 'personalInfo':
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden select-none">
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/resumes"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="Back to Resumes"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <input
            type="text"
            value={resume.title}
            onChange={(e) => updateTitle(e.target.value)}
            className="font-bold text-sm text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 max-w-[200px] sm:max-w-xs truncate"
            title="Click to rename resume"
          />

          {/* Autosave Status */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 ml-2">
            {isSaving ? (
              <span className="text-blue-600 font-medium animate-pulse">Saving...</span>
            ) : isDirty ? (
              <span className="text-amber-600 font-medium">Unsaved changes</span>
            ) : (
              <span className="text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Saved
              </span>
            )}
          </div>
        </div>

        {/* Center: Content vs Customize vs AI Tools Switcher */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setEditorMode('content')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              editorMode === 'content'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Content</span>
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('customize')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              editorMode === 'customize'
                ? 'bg-white text-[#7c3aed] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customize</span>
          </button>
          <button
            type="button"
            onClick={() => setEditorMode('ai')}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              editorMode === 'ai'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-xs'
                : 'text-pink-600 hover:text-pink-700 hover:bg-pink-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Tools</span>
            <span
              className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                editorMode === 'ai' ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-700'
              }`}
            >
              Free
            </span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo */}
          <div className="hidden md:flex items-center border rounded-lg bg-slate-50 p-0.5 mr-1">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
              title="Undo"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
              title="Redo"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* ATS Scanner Button */}
          <button
            type="button"
            onClick={() => setAtsOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 bg-white text-xs font-semibold text-slate-700 shadow-sm transition"
          >
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">ATS Scanner</span>
            {resume.atsScore && (
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 rounded">
                {resume.atsScore}
              </span>
            )}
          </button>

          {/* Customize Mode Trigger */}
          <button
            type="button"
            onClick={() => setEditorMode('customize')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition ${
              editorMode === 'customize'
                ? 'border-[#7c3aed] bg-[#7c3aed]/10 text-[#7c3aed]'
                : 'border-slate-200 hover:border-purple-300 bg-white text-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#7c3aed]" />
            <span className="hidden sm:inline">Customize</span>
          </button>

          {/* Version History */}
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition hidden sm:inline-block"
            title="Version History & Snapshots"
          >
            <History className="w-4 h-4" />
          </button>

          {/* Import */}
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition hidden sm:inline-block"
            title="Import Resume File"
          >
            <UploadCloud className="w-4 h-4" />
          </button>

          {/* Export Dropdown */}
          <ExportDropdown />
        </div>
      </header>

      {/* 3-Panel Main Studio Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel 1: Section Navigation OR FlowCV Customize Menu OR AI Menu */}
        <aside className="w-16 md:w-56 bg-[#f8f8f7] border-r border-slate-200 flex flex-col justify-between py-3 flex-shrink-0">
          {/* Segmented Pill Header in Sidebar */}
          <div className="px-2 mb-2 hidden md:block">
            <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setEditorMode('content')}
                className={`flex-1 py-1 rounded-md transition text-center ${
                  editorMode === 'content'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Content
              </button>
              <button
                type="button"
                onClick={() => setEditorMode('customize')}
                className={`flex-1 py-1 rounded-md transition text-center ${
                  editorMode === 'customize'
                    ? 'bg-white text-[#7c3aed] font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Design
              </button>
              <button
                type="button"
                onClick={() => setEditorMode('ai')}
                className={`flex-1 py-1 rounded-md transition text-center ${
                  editorMode === 'ai'
                    ? 'bg-white text-pink-600 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                AI Tools
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {editorMode === 'content' ? (
              <div className="space-y-1 px-2">
                <div className="flex items-center justify-between px-2 mb-2 hidden md:flex">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Sections
                  </span>
                  <button
                    type="button"
                    onClick={() => setAddContentOpen(true)}
                    className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  const isHidden = hidden.has(sec.id);

                  return (
                    <div
                      key={sec.id}
                      onClick={() => setActiveSection(sec.id)}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden md:inline truncate">{sec.label}</span>
                      </div>

                      {sec.id !== 'personalInfo' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSectionVisibility(sec.id);
                          }}
                          className="hidden md:inline p-0.5 opacity-60 hover:opacity-100"
                          title={isHidden ? 'Show Section' : 'Hide Section'}
                        >
                          {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* FlowCV Style "+ Add Section" button */}
                <button
                  type="button"
                  onClick={() => setAddContentOpen(true)}
                  className="w-full mt-3 py-2 px-2.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 bg-white/70 hover:bg-blue-50/40 text-slate-700 hover:text-blue-600 text-xs font-bold flex items-center justify-center gap-1.5 transition group shadow-2xs"
                  title="Add new section / content"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600" />
                  <span className="hidden md:inline">Add Content</span>
                </button>
              </div>
            ) : editorMode === 'customize' ? (
              <CustomizeSidebar
                activeTab={customizeTab}
                onSelectTab={setCustomizeTab}
              />
            ) : (
              <div className="p-3 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                  AI Features
                </span>
                <div className="p-3 bg-pink-50/70 border border-pink-200/80 rounded-xl text-xs text-pink-900 font-medium">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                    100% Free AI
                  </div>
                  All AI features are available free of charge. No subscriptions, tokens, or watermarks.
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action */}
          <div className="px-3 pt-3 border-t border-slate-200">
            {editorMode === 'content' ? (
              <button
                type="button"
                onClick={() => saveResume(true, 'Manual user milestone')}
                className="w-full py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] rounded-lg transition border border-slate-200/90 flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Save Snapshot</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEditorMode('content')}
                className="w-full py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-[11px] rounded-lg transition border border-slate-200/90 text-center shadow-xs"
              >
                Back to Content
              </button>
            )}
          </div>
        </aside>

        {/* Panel 2: Form Editor OR Customize Panel OR AI Tools Panel */}
        <div
          className={`bg-white border-r border-slate-200 overflow-y-auto p-6 flex-shrink-0 shadow-sm ${
            editorMode === 'ai' ? 'w-full md:w-[580px] lg:w-[650px]' : 'w-full md:w-[480px] lg:w-[540px]'
          }`}
        >
          {editorMode === 'content' ? (
            renderActiveSectionForm()
          ) : editorMode === 'customize' ? (
            <CustomizePanel activeTab={customizeTab} />
          ) : (
            <AiToolsPanel onOpenJdMatcher={() => setAtsOpen(true)} />
          )}
        </div>

        {/* Panel 3: Live Document Preview */}
        <div className="flex-1 bg-slate-200/70 overflow-auto p-6 md:p-10 flex flex-col items-center relative">
          {/* Zoom & View Controls Floating Bar */}
          <div className="sticky top-0 z-20 mb-4 bg-white/95 backdrop-blur shadow-md border border-slate-200/80 px-3 py-1.5 rounded-full flex items-center gap-3 text-xs font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
              className="p-1 hover:text-blue-600"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] w-8 text-center">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
              className="p-1 hover:text-blue-600"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="h-3 w-px bg-slate-200" />
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="hover:text-blue-600 text-[11px]"
            >
              Reset
            </button>
            <span className="h-3 w-px bg-slate-200" />
            <span className="text-[10px] font-mono text-slate-400 uppercase">
              {resume.design?.paperSize || 'A4'}
            </span>
          </div>

          {/* Printable Document Display */}
          <ResumeDocument data={resume.data} design={resume.design} zoom={zoomLevel} />
        </div>
      </div>

      {/* Drawers and Modals */}
      <DesignSettingsDrawer isOpen={designOpen} onClose={() => setDesignOpen(false)} />
      <AtsAnalyzerModal isOpen={atsOpen} onClose={() => setAtsOpen(false)} />
      <VersionHistoryDrawer isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
      <ImportResumeModal isOpen={importOpen} onClose={() => setImportOpen(false)} />
      <AddContentModal
        isOpen={addContentOpen}
        onClose={() => setAddContentOpen(false)}
        onSelectSection={handleAddOrActivateSection}
        activeSections={activeSectionsList}
      />
    </div>
  );
};

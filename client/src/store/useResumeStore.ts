import { create } from 'zustand';
import { ResumeModel, ResumeData, DesignSettings } from '../types/index.js';
import { api } from '../services/api.js';

interface ResumeState {
  resume: ResumeModel | null;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  history: ResumeData[];
  historyIndex: number;
  activeSection: string;
  zoomLevel: number;

  // Actions
  setResume: (resume: ResumeModel) => void;
  setActiveSection: (section: string) => void;
  setZoomLevel: (zoom: number) => void;

  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  updateExperience: (items: ResumeData['experience']) => void;
  updateEducation: (items: ResumeData['education']) => void;
  updateSkills: (categories: ResumeData['skillCategories']) => void;
  updateProjects: (items: ResumeData['projects']) => void;
  updateCertifications: (items: ResumeData['certifications']) => void;
  updateAwards: (items: ResumeData['awards']) => void;
  updatePublications: (items: ResumeData['publications']) => void;
  updateVolunteering: (items: ResumeData['volunteering']) => void;
  updateInterests: (interests: string[]) => void;
  updateReferences: (items: ResumeData['references']) => void;
  updateCustomSections: (sections: ResumeData['customSections']) => void;
  updateSectionOrder: (order: string[]) => void;
  toggleSectionVisibility: (sectionKey: string) => void;

  updateDesign: (design: Partial<DesignSettings>) => void;
  updateTitle: (title: string) => void;

  undo: () => void;
  redo: () => void;
  pushHistory: (data: ResumeData) => void;

  saveResume: (createSnapshot?: boolean, snapshotLabel?: string) => Promise<void>;
}

let autoSaveTimer: any = null;

export const useResumeStore = create<ResumeState>((set, get) => ({
  resume: null,
  isLoading: false,
  isSaving: false,
  isDirty: false,
  lastSaved: null,
  history: [],
  historyIndex: -1,
  activeSection: 'personalInfo',
  zoomLevel: 100,

  setResume: (resume) => {
    set({
      resume,
      history: [JSON.parse(JSON.stringify(resume.data))],
      historyIndex: 0,
      isDirty: false,
      lastSaved: new Date(),
    });
  },

  setActiveSection: (activeSection) => set({ activeSection }),
  setZoomLevel: (zoomLevel) => set({ zoomLevel }),

  pushHistory: (data) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(data)));
    // keep max 25 history states
    if (newHistory.length > 25) newHistory.shift();

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isDirty: true,
    });

    // Trigger debounced autosave
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      get().saveResume();
    }, 2000);
  },

  updatePersonalInfo: (info) => {
    const { resume } = get();
    if (!resume) return;
    const newData: ResumeData = {
      ...resume.data,
      personalInfo: { ...resume.data.personalInfo, ...info },
    };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  updateExperience: (items) => {
    const { resume } = get();
    if (!resume) return;
    const newData: ResumeData = { ...resume.data, experience: items };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  updateEducation: (items) => {
    const { resume } = get();
    if (!resume) return;
    const newData: ResumeData = { ...resume.data, education: items };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  updateSkills: (categories) => {
    const { resume } = get();
    if (!resume) return;
    const newData: ResumeData = { ...resume.data, skillCategories: categories };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  updateProjects: (items) => {
    const { resume } = get();
    if (!resume) return;
    const newData: ResumeData = { ...resume.data, projects: items };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  updateCertifications: (items) => {
    const { resume } = get();
    if (!resume) return;
    const newData: ResumeData = { ...resume.data, certifications: items };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  updateAwards: (items) => {
    const { resume } = get();
    if (!resume) return;
    const newData: ResumeData = { ...resume.data, awards: items };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  updatePublications: (items) => {
    const { resume } = get();
    if (!resume) return;
    const newData: ResumeData = { ...resume.data, publications: items };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  updateVolunteering: (items) => {
    const { resume } = get();
    if (!resume) return;
    const newData: ResumeData = { ...resume.data, volunteering: items };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  updateInterests: (interests) => {
    const { resume } = get();
    if (!resume) return;
    const newData: ResumeData = { ...resume.data, interests };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  updateReferences: (items) => {
    const { resume } = get();
    if (!resume) return;
    const newData: ResumeData = { ...resume.data, references: items };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  updateCustomSections: (sections) => {
    const { resume } = get();
    if (!resume) return;
    const newData: ResumeData = { ...resume.data, customSections: sections };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  updateSectionOrder: (order) => {
    const { resume } = get();
    if (!resume) return;
    const newData: ResumeData = { ...resume.data, sectionOrder: order };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  toggleSectionVisibility: (sectionKey) => {
    const { resume } = get();
    if (!resume) return;
    const hidden = new Set(resume.data.hiddenSections || []);
    if (hidden.has(sectionKey)) {
      hidden.delete(sectionKey);
    } else {
      hidden.add(sectionKey);
    }
    const newData: ResumeData = { ...resume.data, hiddenSections: Array.from(hidden) };
    set({ resume: { ...resume, data: newData } });
    get().pushHistory(newData);
  },

  updateDesign: (designUpdates) => {
    const { resume } = get();
    if (!resume) return;
    const newDesign: DesignSettings = { ...resume.design, ...designUpdates };
    set({ resume: { ...resume, design: newDesign }, isDirty: true });

    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      get().saveResume();
    }, 1500);
  },

  updateTitle: (title) => {
    const { resume } = get();
    if (!resume) return;
    set({ resume: { ...resume, title }, isDirty: true });
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
      get().saveResume();
    }, 1500);
  },

  undo: () => {
    const { history, historyIndex, resume } = get();
    if (historyIndex > 0 && resume) {
      const prev = history[historyIndex - 1];
      set({
        historyIndex: historyIndex - 1,
        resume: { ...resume, data: JSON.parse(JSON.stringify(prev)) },
        isDirty: true,
      });
    }
  },

  redo: () => {
    const { history, historyIndex, resume } = get();
    if (historyIndex < history.length - 1 && resume) {
      const next = history[historyIndex + 1];
      set({
        historyIndex: historyIndex + 1,
        resume: { ...resume, data: JSON.parse(JSON.stringify(next)) },
        isDirty: true,
      });
    }
  },

  saveResume: async (createSnapshot = false, snapshotLabel) => {
    const { resume, isSaving } = get();
    if (!resume || isSaving) return;

    try {
      set({ isSaving: true });
      const updated = await api.updateResume(resume._id, {
        title: resume.title,
        templateId: resume.design.templateId,
        data: resume.data,
        design: resume.design,
        createSnapshot,
        snapshotLabel,
      });
      set({
        resume: updated.resume,
        isSaving: false,
        isDirty: false,
        lastSaved: new Date(),
      });
    } catch (err) {
      console.error('Failed to autosave resume', err);
      set({ isSaving: false });
    }
  },
}));

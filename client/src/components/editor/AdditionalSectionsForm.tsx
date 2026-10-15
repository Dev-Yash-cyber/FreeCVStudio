import React from 'react';
import { useResumeStore } from '../../store/useResumeStore.js';
import {
  Bookmark,
  Plus,
  Trash2,
  Award,
  BookOpen,
  Heart,
  Users,
  Sparkles,
  FileBadge,
  Building2,
  BookText,
  UserCheck,
  FolderPlus,
} from 'lucide-react';
import {
  CertificationItem,
  AwardItem,
  VolunteeringItem,
  PublicationItem,
  ReferenceItem,
  CustomSection,
  CustomSectionItem,
} from '../../types/index.js';

export const AdditionalSectionsForm: React.FC = () => {
  const {
    resume,
    updateCertifications,
    updateAwards,
    updatePublications,
    updateVolunteering,
    updateInterests,
    updateReferences,
    updateCustomSections,
  } = useResumeStore();

  const data = resume?.data || ({} as any);

  // 1. Certifications
  const certs: CertificationItem[] = data.certifications || [];
  const handleAddCert = () => {
    updateCertifications([
      ...certs,
      { id: `cert-${Date.now()}`, name: '', issuer: '', issueDate: '' },
    ]);
  };
  const handleUpdateCert = (idx: number, updates: Partial<CertificationItem>) => {
    const updated = [...certs];
    updated[idx] = { ...updated[idx], ...updates };
    updateCertifications(updated);
  };
  const handleDeleteCert = (idx: number) => {
    updateCertifications(certs.filter((_, i) => i !== idx));
  };

  // 2. Awards
  const awards: AwardItem[] = data.awards || [];
  const handleAddAward = () => {
    updateAwards([...awards, { id: `award-${Date.now()}`, title: '', issuer: '', date: '' }]);
  };
  const handleUpdateAward = (idx: number, updates: Partial<AwardItem>) => {
    const updated = [...awards];
    updated[idx] = { ...updated[idx], ...updates };
    updateAwards(updated);
  };
  const handleDeleteAward = (idx: number) => {
    updateAwards(awards.filter((_, i) => i !== idx));
  };

  // 3. Volunteering & Leadership
  const volunteering: VolunteeringItem[] = data.volunteering || [];
  const handleAddVolunteering = () => {
    updateVolunteering([
      ...volunteering,
      {
        id: `vol-${Date.now()}`,
        organization: '',
        role: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        bulletPoints: [''],
      },
    ]);
  };
  const handleUpdateVolunteering = (idx: number, updates: Partial<VolunteeringItem>) => {
    const updated = [...volunteering];
    updated[idx] = { ...updated[idx], ...updates };
    updateVolunteering(updated);
  };
  const handleDeleteVolunteering = (idx: number) => {
    updateVolunteering(volunteering.filter((_, i) => i !== idx));
  };

  // 4. Publications
  const publications: PublicationItem[] = data.publications || [];
  const handleAddPublication = () => {
    updatePublications([
      ...publications,
      { id: `pub-${Date.now()}`, title: '', publisher: '', date: '', description: '' },
    ]);
  };
  const handleUpdatePublication = (idx: number, updates: Partial<PublicationItem>) => {
    const updated = [...publications];
    updated[idx] = { ...updated[idx], ...updates };
    updatePublications(updated);
  };
  const handleDeletePublication = (idx: number) => {
    updatePublications(publications.filter((_, i) => i !== idx));
  };

  // 5. References
  const references: ReferenceItem[] = data.references || [];
  const handleAddReference = () => {
    updateReferences([
      ...references,
      { id: `ref-${Date.now()}`, name: '', title: '', company: '', email: '', phone: '' },
    ]);
  };
  const handleUpdateReference = (idx: number, updates: Partial<ReferenceItem>) => {
    const updated = [...references];
    updated[idx] = { ...updated[idx], ...updates };
    updateReferences(updated);
  };
  const handleDeleteReference = (idx: number) => {
    updateReferences(references.filter((_, i) => i !== idx));
  };

  // 6. Custom Sections (Courses, Declaration, Custom Activities)
  const customSections: CustomSection[] = data.customSections || [];
  const handleAddCustomSection = () => {
    const newSec: CustomSection = {
      id: `sec-custom-${Date.now()}`,
      sectionTitle: 'Custom Section',
      items: [
        {
          id: `item-${Date.now()}`,
          title: '',
          subtitle: '',
          date: '',
          description: '',
          bulletPoints: [],
        },
      ],
    };
    updateCustomSections([...customSections, newSec]);
  };
  const handleUpdateCustomSectionTitle = (secIdx: number, title: string) => {
    const updated = [...customSections];
    updated[secIdx] = { ...updated[secIdx], sectionTitle: title };
    updateCustomSections(updated);
  };
  const handleDeleteCustomSection = (secIdx: number) => {
    updateCustomSections(customSections.filter((_, i) => i !== secIdx));
  };
  const handleAddCustomSectionItem = (secIdx: number) => {
    const updated = [...customSections];
    const sec = updated[secIdx];
    sec.items = [
      ...sec.items,
      { id: `item-${Date.now()}`, title: '', subtitle: '', date: '', description: '', bulletPoints: [] },
    ];
    updateCustomSections(updated);
  };
  const handleUpdateCustomSectionItem = (
    secIdx: number,
    itemIdx: number,
    updates: Partial<CustomSectionItem>
  ) => {
    const updated = [...customSections];
    const items = [...updated[secIdx].items];
    items[itemIdx] = { ...items[itemIdx], ...updates };
    updated[secIdx].items = items;
    updateCustomSections(updated);
  };
  const handleDeleteCustomSectionItem = (secIdx: number, itemIdx: number) => {
    const updated = [...customSections];
    updated[secIdx].items = updated[secIdx].items.filter((_, i) => i !== itemIdx);
    updateCustomSections(updated);
  };

  // 7. Interests
  const interests: string[] = data.interests || [];
  const handleUpdateInterests = (text: string) => {
    const items = text.split(',').map((s) => s.trim()).filter(Boolean);
    updateInterests(items);
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-blue-600" />
          Additional & Custom Sections
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Add certifications, awards, volunteering, courses, publications, references, or custom sections.
        </p>
      </div>

      {/* Certifications Section */}
      <div className="space-y-3 p-4 border border-slate-200 rounded-xl bg-slate-50/40">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileBadge className="w-4 h-4 text-blue-600" />
            Certifications & Licenses
          </h3>
          <button
            type="button"
            onClick={handleAddCert}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Certification
          </button>
        </div>
        {certs.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-1">No certifications added yet.</p>
        ) : (
          certs.map((c, idx) => (
            <div key={c.id} className="grid grid-cols-12 gap-2 items-center p-3 border rounded-lg bg-white shadow-2xs">
              <input
                type="text"
                value={c.name}
                onChange={(e) => handleUpdateCert(idx, { name: e.target.value })}
                placeholder="Certificate Name (e.g. AWS Solutions Architect)"
                className="col-span-6 px-2.5 py-1.5 text-xs border rounded"
              />
              <input
                type="text"
                value={c.issuer}
                onChange={(e) => handleUpdateCert(idx, { issuer: e.target.value })}
                placeholder="Issuer (e.g. Amazon Web Services)"
                className="col-span-4 px-2.5 py-1.5 text-xs border rounded"
              />
              <input
                type="text"
                value={c.issueDate || ''}
                onChange={(e) => handleUpdateCert(idx, { issueDate: e.target.value })}
                placeholder="Year"
                className="col-span-1 px-1.5 py-1.5 text-xs border rounded"
              />
              <button
                type="button"
                onClick={() => handleDeleteCert(idx)}
                className="col-span-1 text-slate-400 hover:text-red-500 p-1 flex justify-center"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Honors & Awards Section */}
      <div className="space-y-3 p-4 border border-slate-200 rounded-xl bg-slate-50/40">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            Honors & Awards
          </h3>
          <button
            type="button"
            onClick={handleAddAward}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Award
          </button>
        </div>
        {awards.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-1">No awards added yet.</p>
        ) : (
          awards.map((a, idx) => (
            <div key={a.id} className="grid grid-cols-12 gap-2 items-center p-3 border rounded-lg bg-white shadow-2xs">
              <input
                type="text"
                value={a.title}
                onChange={(e) => handleUpdateAward(idx, { title: e.target.value })}
                placeholder="Award Title (e.g. Employee of the Year)"
                className="col-span-6 px-2.5 py-1.5 text-xs border rounded"
              />
              <input
                type="text"
                value={a.issuer}
                onChange={(e) => handleUpdateAward(idx, { issuer: e.target.value })}
                placeholder="Grantor / Organization"
                className="col-span-4 px-2.5 py-1.5 text-xs border rounded"
              />
              <input
                type="text"
                value={a.date || ''}
                onChange={(e) => handleUpdateAward(idx, { date: e.target.value })}
                placeholder="Year"
                className="col-span-1 px-1.5 py-1.5 text-xs border rounded"
              />
              <button
                type="button"
                onClick={() => handleDeleteAward(idx)}
                className="col-span-1 text-slate-400 hover:text-red-500 p-1 flex justify-center"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Volunteering & Leadership */}
      <div className="space-y-3 p-4 border border-slate-200 rounded-xl bg-slate-50/40">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Volunteering & Leadership
          </h3>
          <button
            type="button"
            onClick={handleAddVolunteering}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Volunteering
          </button>
        </div>
        {volunteering.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-1">No volunteering activities added yet.</p>
        ) : (
          volunteering.map((v, idx) => (
            <div key={v.id} className="p-3 border rounded-lg bg-white shadow-2xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">Role #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteVolunteering(idx)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={v.role}
                  onChange={(e) => handleUpdateVolunteering(idx, { role: e.target.value })}
                  placeholder="Role (e.g. Volunteer Mentor)"
                  className="px-2.5 py-1.5 text-xs border rounded"
                />
                <input
                  type="text"
                  value={v.organization}
                  onChange={(e) => handleUpdateVolunteering(idx, { organization: e.target.value })}
                  placeholder="Organization (e.g. Red Cross)"
                  className="px-2.5 py-1.5 text-xs border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={v.startDate || ''}
                  onChange={(e) => handleUpdateVolunteering(idx, { startDate: e.target.value })}
                  placeholder="Start Date (e.g. 2022)"
                  className="px-2.5 py-1.5 text-xs border rounded"
                />
                <input
                  type="text"
                  value={v.endDate || ''}
                  onChange={(e) => handleUpdateVolunteering(idx, { endDate: e.target.value })}
                  placeholder="End Date (e.g. Present)"
                  className="px-2.5 py-1.5 text-xs border rounded"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Publications & Research */}
      <div className="space-y-3 p-4 border border-slate-200 rounded-xl bg-slate-50/40">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookText className="w-4 h-4 text-indigo-600" />
            Publications & Research
          </h3>
          <button
            type="button"
            onClick={handleAddPublication}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Publication
          </button>
        </div>
        {publications.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-1">No publications added yet.</p>
        ) : (
          publications.map((p, idx) => (
            <div key={p.id} className="p-3 border rounded-lg bg-white shadow-2xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">Publication #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleDeletePublication(idx)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={p.title}
                  onChange={(e) => handleUpdatePublication(idx, { title: e.target.value })}
                  placeholder="Paper / Book Title"
                  className="px-2.5 py-1.5 text-xs border rounded"
                />
                <input
                  type="text"
                  value={p.publisher}
                  onChange={(e) => handleUpdatePublication(idx, { publisher: e.target.value })}
                  placeholder="Publisher / Journal"
                  className="px-2.5 py-1.5 text-xs border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={p.date || ''}
                  onChange={(e) => handleUpdatePublication(idx, { date: e.target.value })}
                  placeholder="Date / Year"
                  className="px-2.5 py-1.5 text-xs border rounded"
                />
                <input
                  type="text"
                  value={p.url || ''}
                  onChange={(e) => handleUpdatePublication(idx, { url: e.target.value })}
                  placeholder="URL / DOI link (optional)"
                  className="px-2.5 py-1.5 text-xs border rounded"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* References */}
      <div className="space-y-3 p-4 border border-slate-200 rounded-xl bg-slate-50/40">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-600" />
            Professional References
          </h3>
          <button
            type="button"
            onClick={handleAddReference}
            className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Reference
          </button>
        </div>
        {references.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-1">No references added yet.</p>
        ) : (
          references.map((r, idx) => (
            <div key={r.id} className="p-3 border rounded-lg bg-white shadow-2xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-600">Reference #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteReference(idx)}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={r.name}
                  onChange={(e) => handleUpdateReference(idx, { name: e.target.value })}
                  placeholder="Full Name"
                  className="px-2.5 py-1.5 text-xs border rounded"
                />
                <input
                  type="text"
                  value={r.title}
                  onChange={(e) => handleUpdateReference(idx, { title: e.target.value })}
                  placeholder="Title (e.g. VP of Engineering)"
                  className="px-2.5 py-1.5 text-xs border rounded"
                />
                <input
                  type="text"
                  value={r.company}
                  onChange={(e) => handleUpdateReference(idx, { company: e.target.value })}
                  placeholder="Company"
                  className="px-2.5 py-1.5 text-xs border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={r.email || ''}
                  onChange={(e) => handleUpdateReference(idx, { email: e.target.value })}
                  placeholder="Email"
                  className="px-2.5 py-1.5 text-xs border rounded"
                />
                <input
                  type="text"
                  value={r.phone || ''}
                  onChange={(e) => handleUpdateReference(idx, { phone: e.target.value })}
                  placeholder="Phone"
                  className="px-2.5 py-1.5 text-xs border rounded"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Custom Sections (Courses, Declaration, Custom Titles) */}
      <div className="space-y-4 p-4 border-2 border-blue-200/80 rounded-xl bg-blue-50/20">
        <div className="flex justify-between items-center border-b border-blue-200 pb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-blue-600" />
              Custom Sections & Additional Content
            </h3>
            <p className="text-[11px] text-slate-500">
              Create your own bespoke sections (e.g. Courses, Declaration, Speaking Engagements, Patents).
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddCustomSection}
            className="text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> + New Section
          </button>
        </div>

        {customSections.length === 0 ? (
          <div className="text-center py-4 border border-dashed border-slate-300 rounded-lg bg-white/60">
            <p className="text-xs text-slate-500">No custom sections created yet.</p>
            <button
              type="button"
              onClick={handleAddCustomSection}
              className="mt-2 text-xs font-bold text-blue-600 hover:underline"
            >
              + Create custom section
            </button>
          </div>
        ) : (
          customSections.map((sec, secIdx) => (
            <div key={sec.id} className="p-4 border border-slate-300 rounded-xl bg-white shadow-xs space-y-3">
              <div className="flex justify-between items-center gap-2 border-b pb-2">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={sec.sectionTitle}
                    onChange={(e) => handleUpdateCustomSectionTitle(secIdx, e.target.value)}
                    placeholder="Section Title (e.g. Courses & Trainings, Declaration...)"
                    className="w-full px-3 py-1.5 text-xs font-bold text-slate-900 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => handleAddCustomSectionItem(secIdx)}
                    className="px-2.5 py-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                  >
                    + Add Item
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCustomSection(secIdx)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded"
                    title="Delete entire section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Items within this custom section */}
              <div className="space-y-3 pt-1">
                {sec.items.map((item, itemIdx) => (
                  <div key={item.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-500">Item #{itemIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomSectionItem(secIdx, itemIdx)}
                        className="text-slate-400 hover:text-red-500 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          handleUpdateCustomSectionItem(secIdx, itemIdx, { title: e.target.value })
                        }
                        placeholder="Title / Course / Program"
                        className="px-2.5 py-1.5 text-xs border rounded bg-white"
                      />
                      <input
                        type="text"
                        value={item.subtitle || ''}
                        onChange={(e) =>
                          handleUpdateCustomSectionItem(secIdx, itemIdx, { subtitle: e.target.value })
                        }
                        placeholder="Organization / Platform / Subtitle"
                        className="px-2.5 py-1.5 text-xs border rounded bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={item.date || ''}
                        onChange={(e) =>
                          handleUpdateCustomSectionItem(secIdx, itemIdx, { date: e.target.value })
                        }
                        placeholder="Date / Year"
                        className="px-2.5 py-1.5 text-xs border rounded bg-white"
                      />
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) =>
                          handleUpdateCustomSectionItem(secIdx, itemIdx, { description: e.target.value })
                        }
                        placeholder="Short description or summary statement"
                        className="px-2.5 py-1.5 text-xs border rounded bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Interests */}
      <div className="space-y-2 p-4 border border-slate-200 rounded-xl bg-slate-50/40">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Interests & Extracurricular Activities
        </h3>
        <input
          type="text"
          value={interests.join(', ')}
          onChange={(e) => handleUpdateInterests(e.target.value)}
          placeholder="e.g. Open Source, Marathons, Chess, System Architecture, Robotics (comma separated)"
          className="w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
        />
      </div>
    </div>
  );
};

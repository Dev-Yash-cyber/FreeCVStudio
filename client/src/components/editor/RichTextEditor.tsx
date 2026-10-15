import React, { useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Sparkles,
  CheckCircle2,
  Scissors,
  Lightbulb,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { api } from '../../services/api.js';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  jobTitle?: string;
  minRows?: number;
  showAiHelpers?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Write a detailed description, responsibilities, or measurable achievements...',
  label,
  jobTitle = 'Software Engineer',
  minRows = 3,
  showAiHelpers = true,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [loadingAi, setLoadingAi] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<{
    title: string;
    description?: string;
    items: string[];
    isGrammar?: boolean;
  } | null>(null);

  // Helper to apply formatting to selection or insert template
  const applyFormat = (type: 'bold' | 'italic' | 'underline' | 'bullet' | 'link' | 'align', alignType?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    let replacement = '';
    let newCursorPos = start;

    switch (type) {
      case 'bold':
        if (selected.startsWith('**') && selected.endsWith('**')) {
          replacement = selected.slice(2, -2);
        } else {
          replacement = selected ? `**${selected}**` : '**bold text**';
        }
        break;

      case 'italic':
        if (selected.startsWith('*') && selected.endsWith('*')) {
          replacement = selected.slice(1, -1);
        } else {
          replacement = selected ? `*${selected}*` : '*italic text*';
        }
        break;

      case 'underline':
        if (selected.startsWith('<u>') && selected.endsWith('</u>')) {
          replacement = selected.slice(3, -4);
        } else {
          replacement = selected ? `<u>${selected}</u>` : '<u>underlined text</u>';
        }
        break;

      case 'bullet':
        if (selected) {
          replacement = selected
            .split('\n')
            .map((line) => (line.startsWith('• ') ? line.substring(2) : `• ${line}`))
            .join('\n');
        } else {
          replacement = '• ';
        }
        break;

      case 'link': {
        const url = window.prompt('Enter link URL (e.g. https://github.com/yourname):', 'https://');
        if (!url) return;
        const linkText = selected || 'link text';
        replacement = `[${linkText}](${url})`;
        break;
      }

      case 'align': {
        const alignVal = alignType || 'left';
        if (selected) {
          // Wrap selected text in alignment container
          replacement = `<div align="${alignVal}">${selected}</div>`;
        } else {
          replacement = `<div align="${alignVal}">text</div>`;
        }
        break;
      }
    }

    const updated = value.substring(0, start) + replacement + value.substring(end);
    onChange(updated);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        newCursorPos = start + replacement.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 10);
  };

  // AI Helper: Improve Writing
  const handleImproveWriting = async () => {
    if (!value.trim()) {
      applyFormat('bullet');
      return;
    }
    setLoadingAi('improve');
    try {
      const res = await api.improveBullet({
        originalText: value,
        jobTitle,
        tone: 'professional',
      });
      setAiSuggestions({
        title: 'High-Impact Professional Improvements',
        description: 'Choose a polished alternative tailored to showcase leadership and results:',
        items: res.suggestions || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(null);
    }
  };

  // AI Helper: Suggest Content
  const handleSuggestContent = async () => {
    setLoadingAi('suggest');
    try {
      // Suggest high-converting achievements based on job title
      const promptText = value.trim() || `Key responsibilities and achievements as ${jobTitle}`;
      const res = await api.improveBullet({
        originalText: promptText,
        jobTitle,
        tone: 'executive',
      });
      setAiSuggestions({
        title: `Recommended Content for ${jobTitle}`,
        description: 'Click any industry-tested bullet point or statement to add it to your description:',
        items: res.suggestions || [
          `Spearheaded development of scalable microservices architecture reducing operational overhead by 25%.`,
          `Engineered responsive, accessible web interfaces adopted by 150,000+ monthly active enterprise users.`,
          `Partnered with cross-functional leadership to define core technical roadmaps and accelerate sprint velocity by 20%.`,
          `Implemented automated CI/CD deployment pipelines, cutting release failure rates by 40%.`,
        ],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(null);
    }
  };

  // AI Helper: Grammar Check
  const handleGrammarCheck = async () => {
    if (!value.trim()) return;
    setLoadingAi('grammar');
    try {
      const res = await api.checkGrammar({ text: value });
      if (res.issues && res.issues.length > 0) {
        const fixes = res.issues.map(
          (iss: any) => `${iss.suggested} (${iss.explanation || 'Optimized'})`
        );
        // Also provide full auto-corrected text
        let fullCorrected = value;
        res.issues.forEach((iss: any) => {
          if (iss.suggested && iss.original) {
            fullCorrected = fullCorrected.replace(iss.original, iss.suggested);
          }
        });

        setAiSuggestions({
          title: 'Grammar & Style Recommendations',
          description: `Found ${res.issues.length} opportunity to strengthen clarity and replace passive voice:`,
          items: [fullCorrected, ...fixes],
          isGrammar: true,
        });
      } else {
        setAiSuggestions({
          title: 'Grammar & Tone Verified',
          description: 'No grammar mistakes or passive phrasing detected! Your content looks professional and punchy.',
          items: [value],
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(null);
    }
  };

  // AI Helper: Shorter
  const handleMakeShorter = async () => {
    if (!value.trim()) return;
    setLoadingAi('shorter');
    try {
      const res = await api.improveBullet({
        originalText: value,
        jobTitle,
        tone: 'concise',
      });
      setAiSuggestions({
        title: 'Concise & High-Density Alternatives',
        description: 'Shortened variations that keep maximum impact with fewer words:',
        items: res.suggestions || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAi(null);
    }
  };

  const handleSelectSuggestion = (text: string) => {
    onChange(text);
    setAiSuggestions(null);
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}

      {/* Toolbar */}
      <div className="border border-slate-300 rounded-t-lg bg-slate-50 px-2 py-1.5 flex items-center flex-wrap gap-1 text-slate-600 border-b-0">
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          title="Bold (Ctrl+B / **text**)"
          className="p-1 hover:bg-slate-200 rounded font-bold text-xs text-slate-800 transition"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => applyFormat('italic')}
          title="Italic (Ctrl+I / *text*)"
          className="p-1 hover:bg-slate-200 rounded italic text-xs text-slate-800 transition"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => applyFormat('underline')}
          title="Underline (<u>text</u>)"
          className="p-1 hover:bg-slate-200 rounded underline text-xs text-slate-800 transition"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-slate-300 mx-0.5" />

        <button
          type="button"
          onClick={() => applyFormat('bullet')}
          title="Bullet list (• Item)"
          className="p-1 hover:bg-slate-200 rounded text-xs text-slate-800 transition"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => applyFormat('link')}
          title="Insert Link [title](url)"
          className="p-1 hover:bg-slate-200 rounded text-xs text-slate-800 transition"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-slate-300 mx-0.5" />

        <button
          type="button"
          onClick={() => applyFormat('align', 'left')}
          title="Align Left"
          className="p-1 hover:bg-slate-200 rounded text-xs text-slate-800 transition"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => applyFormat('align', 'center')}
          title="Align Center"
          className="p-1 hover:bg-slate-200 rounded text-xs text-slate-800 transition"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => applyFormat('align', 'right')}
          title="Align Right"
          className="p-1 hover:bg-slate-200 rounded text-xs text-slate-800 transition"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => applyFormat('align', 'justify')}
          title="Justify"
          className="p-1 hover:bg-slate-200 rounded text-xs text-slate-800 transition"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        rows={minRows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2.5 text-xs text-slate-800 border border-slate-300 rounded-b-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-sans leading-relaxed resize-y"
      />

      {/* FlowCV-Style AI Action Pills */}
      {showAiHelpers && (
        <div className="flex items-center flex-wrap gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={handleImproveWriting}
            disabled={!!loadingAi}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full border border-blue-200 transition disabled:opacity-50"
          >
            {loadingAi === 'improve' ? (
              <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
            ) : (
              <Sparkles className="w-3 h-3 text-blue-600" />
            )}
            Improve Writing
          </button>

          <button
            type="button"
            onClick={handleSuggestContent}
            disabled={!!loadingAi}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-full border border-purple-200 transition disabled:opacity-50"
          >
            {loadingAi === 'suggest' ? (
              <Loader2 className="w-3 h-3 animate-spin text-purple-600" />
            ) : (
              <Lightbulb className="w-3 h-3 text-purple-600" />
            )}
            Suggest Content
          </button>

          <button
            type="button"
            onClick={handleGrammarCheck}
            disabled={!!loadingAi}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 transition disabled:opacity-50"
          >
            {loadingAi === 'grammar' ? (
              <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
            ) : (
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            )}
            Grammar Check
          </button>

          <button
            type="button"
            onClick={handleMakeShorter}
            disabled={!!loadingAi}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-full border border-amber-200 transition disabled:opacity-50"
          >
            {loadingAi === 'shorter' ? (
              <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
            ) : (
              <Scissors className="w-3 h-3 text-amber-600" />
            )}
            Shorter
          </button>
        </div>
      )}

      {/* AI Suggestions Modal */}
      {aiSuggestions && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-5 shadow-2xl space-y-3.5 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                {aiSuggestions.title}
              </h3>
              <button
                type="button"
                onClick={() => setAiSuggestions(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {aiSuggestions.description && (
              <p className="text-xs text-slate-500 leading-normal">
                {aiSuggestions.description}
              </p>
            )}

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {aiSuggestions.items.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSuggestion(item)}
                  className="p-3 border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50/60 cursor-pointer transition text-xs leading-relaxed text-slate-800 flex items-start justify-between gap-3 group"
                >
                  <span className="flex-1">{item}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-[10px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded flex items-center gap-1 transition whitespace-nowrap mt-0.5">
                    <Check className="w-3 h-3" /> Apply
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                type="button"
                onClick={() => setAiSuggestions(null)}
                className="text-xs text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

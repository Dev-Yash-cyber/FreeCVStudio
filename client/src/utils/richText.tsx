import React from 'react';
import { ExperienceItem } from '../types/index.js';

/**
 * Parses markdown / HTML-like formatting:
 * - Alignment: <div align="center|right|justify|left">...</div>
 * - Bold: **text**, <b>text</b>, <strong>text</strong>
 * - Italic: *text*, <em>text</em>, <i>text</i>
 * - Underline: <u>text</u>
 * - Links: [text](url)
 * - Line breaks: \n -> <br />
 * into safe React elements.
 */
export function renderRichText(text: string): React.ReactNode {
  if (!text) return '';

  // Check for div alignment blocks first
  const alignBlockRegex = /<div\s+align="(left|center|right|justify)">(.*?)<\/div>/gis;
  if (alignBlockRegex.test(text)) {
    const parts: React.ReactNode[] = [];
    let lastIdx = 0;
    alignBlockRegex.lastIndex = 0;
    let m: RegExpExecArray | null;

    while ((m = alignBlockRegex.exec(text)) !== null) {
      if (m.index > lastIdx) {
        parts.push(renderInlineRichText(text.substring(lastIdx, m.index)));
      }
      const align = m[1] as 'left' | 'center' | 'right' | 'justify';
      const inner = m[2];
      parts.push(
        <div key={m.index} style={{ textAlign: align }}>
          {renderInlineRichText(inner)}
        </div>
      );
      lastIdx = m.index + m[0].length;
    }

    if (lastIdx < text.length) {
      parts.push(renderInlineRichText(text.substring(lastIdx)));
    }
    return parts.length > 0 ? <>{parts}</> : text;
  }

  return renderInlineRichText(text);
}

function renderInlineRichText(text: string): React.ReactNode {
  if (!text) return '';

  // Handle line breaks
  const lines = text.split('\n');
  if (lines.length > 1) {
    return (
      <>
        {lines.map((line, i) => (
          <React.Fragment key={i}>
            {parseInlineElements(line)}
            {i < lines.length - 1 && <br />}
          </React.Fragment>
        ))}
      </>
    );
  }

  return parseInlineElements(text);
}

function parseInlineElements(str: string): React.ReactNode {
  if (!str) return '';

  const regex = /(\*\*([^*]+)\*\*|<b>([^<]+)<\/b>|<strong>([^<]+)<\/strong>|\*([^*]+)\*|<em>([^<]+)<\/em>|<i>([^<]+)<\/i>|<u>([^<]+)<\/u>|\[([^\]]+)\]\(([^)]+)\))/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      elements.push(str.substring(lastIndex, match.index));
    }

    const fullMatch = match[0];
    if (fullMatch.startsWith('**') && fullMatch.endsWith('**')) {
      elements.push(<strong key={match.index} className="font-bold">{match[2]}</strong>);
    } else if (fullMatch.startsWith('<b>') || fullMatch.startsWith('<strong>')) {
      elements.push(<strong key={match.index} className="font-bold">{match[3] || match[4]}</strong>);
    } else if (fullMatch.startsWith('<u>') && fullMatch.endsWith('</u>')) {
      elements.push(<span key={match.index} className="underline underline-offset-2">{match[8]}</span>);
    } else if (fullMatch.startsWith('*') && fullMatch.endsWith('*')) {
      elements.push(<em key={match.index} className="italic">{match[5]}</em>);
    } else if (fullMatch.startsWith('<em>') || fullMatch.startsWith('<i>')) {
      elements.push(<em key={match.index} className="italic">{match[6] || match[7]}</em>);
    } else if (fullMatch.startsWith('[')) {
      elements.push(
        <a
          key={match.index}
          href={match[10]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {match[9]}
        </a>
      );
    }

    lastIndex = match.index + fullMatch.length;
  }

  if (lastIndex < str.length) {
    elements.push(str.substring(lastIndex));
  }

  return elements.length > 0 ? <>{elements}</> : str;
}

export interface GroupedCompanyExperience {
  employer: string;
  positions: ExperienceItem[];
  isMultiple: boolean;
}

/**
 * Groups consecutive experience items that share the same employer name.
 * Matches FlowCV's multiple positions under the same company layout.
 */
export function groupExperiencesByCompany(
  experiences: ExperienceItem[]
): GroupedCompanyExperience[] {
  if (!experiences || experiences.length === 0) return [];

  const groups: GroupedCompanyExperience[] = [];
  const map = new Map<string, GroupedCompanyExperience>();

  experiences.forEach((exp) => {
    const employerTrimmed = (exp.employer || '').trim();
    const key = employerTrimmed.toLowerCase();

    if (key && map.has(key)) {
      const existing = map.get(key)!;
      existing.positions.push(exp);
      existing.isMultiple = true;
    } else {
      const newGroup: GroupedCompanyExperience = {
        employer: exp.employer || 'Company',
        positions: [exp],
        isMultiple: false,
      };
      groups.push(newGroup);
      if (key) {
        map.set(key, newGroup);
      }
    }
  });

  return groups;
}

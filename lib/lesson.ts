import type { JSONContent } from '@tiptap/react';

/** Lesson notes helpers shared by server and client. Reads live in `lib/lessons.ts`. */

export type Lesson = {
  id: string;
  studentId: string;
  number: number;
  topic: string | null;
  content: JSONContent;
  updatedAt: string;
  createdAt: string;
};

export const EMPTY_DOC: JSONContent = { type: 'doc', content: [] };

/** "Lekcja 3 · Negotiations" (or just "Lekcja 3"). */
export const lessonTitle = (lesson: Pick<Lesson, 'number' | 'topic'>) =>
  lesson.topic ? `Lekcja ${lesson.number} · ${lesson.topic}` : `Lekcja ${lesson.number}`;

/** Plain-text preview of the notes for list cards. */
export function lessonPreview(content: JSONContent, max = 140): string {
  const parts: string[] = [];
  const walk = (node: JSONContent) => {
    if (node.text) parts.push(node.text);
    node.content?.forEach(walk);
    // Block boundaries become spaces so "Agenda" + "Prices" don't run together.
    if (node.type !== 'text') parts.push(' ');
  };
  walk(content);
  const text = parts.join('').replace(/\s+/g, ' ').trim();
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

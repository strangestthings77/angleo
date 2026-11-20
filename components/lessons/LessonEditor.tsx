'use client';

import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
  type JSONContent,
} from '@tiptap/react';
import { Placeholder } from '@tiptap/extensions';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/** Autosave at most this often while typing. */
const SAVE_MS = 400;
/** The other side's edit within this window shows as "… pisze". */
const TYPING_MS = 3000;
/** Fallback refresh while Realtime is disconnected. */
const POLL_MS = 3000;

type SaveState = 'saved' | 'saving' | 'error';
type LessonRow = { content: JSONContent; updated_by: string | null };

/**
 * Shared lesson notes: the student and Nicole edit the same document. Every change autosaves
 * through `save_lesson_content()`; the other side gets it via Realtime. While this side has unsaved
 * typing it ignores incoming versions, so whoever is typing keeps their text (last write wins).
 */
export function LessonEditor({
  lessonId,
  userId,
  initialContent,
  otherName,
}: {
  lessonId: string;
  userId: string;
  initialContent: JSONContent;
  /** Who's on the other side — "Nicole" for the student, the student's name for Nicole. */
  otherName: string;
}) {
  const [supabase] = useState(() => createClient());
  const [connected, setConnected] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('saved');
  const [otherTyping, setOtherTyping] = useState(false);

  // Save bookkeeping lives in refs: it changes on every keystroke and must not re-render.
  const version = useRef(0);
  const savedVersion = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inFlight = useRef(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const flushRef = useRef<() => void>(() => {});

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Placeholder.configure({
        placeholder: 'Zacznij pisać — te notatki widzicie oboje…',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'lesson-prose min-h-72 px-5 py-5 focus:outline-none sm:px-8 sm:py-7',
        'aria-label': 'Notatki z lekcji',
      },
    },
    onUpdate: () => {
      version.current += 1;
      setSaveState('saving');
      if (!timer.current) timer.current = setTimeout(() => flushRef.current(), SAVE_MS);
    },
  });

  const flush = useCallback(async () => {
    timer.current = undefined;
    if (!editor || version.current === savedVersion.current) return;
    if (inFlight.current) {
      timer.current = setTimeout(() => flushRef.current(), SAVE_MS);
      return;
    }
    inFlight.current = true;
    const sending = version.current;
    const { error } = await supabase.rpc('save_lesson_content', {
      p_lesson: lessonId,
      p_content: editor.getJSON(),
    });
    inFlight.current = false;
    if (error) {
      setSaveState('error');
      return;
    }
    savedVersion.current = sending;
    if (sending === version.current) setSaveState('saved');
    else if (!timer.current) timer.current = setTimeout(() => flushRef.current(), SAVE_MS);
  }, [editor, supabase, lessonId]);

  useEffect(() => {
    flushRef.current = () => void flush();
  }, [flush]);

  // Incoming version from the other side (or a catch-up read).
  const applyRemote = useCallback(
    (row: LessonRow) => {
      if (!editor || editor.isDestroyed) return;
      if (row.updated_by && row.updated_by !== userId) {
        setOtherTyping(true);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setOtherTyping(false), TYPING_MS);
      }
      // Unsaved local typing wins; our next save overwrites theirs.
      if (version.current !== savedVersion.current || inFlight.current) return;
      if (JSON.stringify(row.content) === JSON.stringify(editor.getJSON())) return;

      const { from, to } = editor.state.selection;
      editor.commands.setContent(row.content, { emitUpdate: false });
      if (editor.isFocused) {
        const end = editor.state.doc.content.size;
        editor.commands.setTextSelection({ from: Math.min(from, end), to: Math.min(to, end) });
      }
    },
    [editor, userId],
  );

  useEffect(() => {
    if (!editor) return;
    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | undefined;
    let channel: ReturnType<typeof supabase.channel> | undefined;

    async function refresh() {
      const { data } = await supabase
        .from('lessons')
        .select('content, updated_by')
        .eq('id', lessonId)
        .maybeSingle<LessonRow>();
      if (!cancelled && data) applyRemote({ ...data, updated_by: null });
    }

    async function connect() {
      // Join with the user's token — joined anonymously, RLS filters out every event.
      await supabase.auth.getSession();
      await supabase.realtime.setAuth();
      if (cancelled) return;
      channel = supabase
        .channel(`lesson-${lessonId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'lessons', filter: `id=eq.${lessonId}` },
          (payload) => applyRemote(payload.new as LessonRow),
        )
        .subscribe((status) => {
          const live = status === 'SUBSCRIBED';
          setConnected(live);
          clearInterval(poll);
          void refresh();
          if (!live) poll = setInterval(() => void refresh(), POLL_MS);
        });
    }

    void connect();
    return () => {
      cancelled = true;
      clearInterval(poll);
      clearTimeout(typingTimer.current);
      if (channel) void supabase.removeChannel(channel);
    };
  }, [editor, supabase, lessonId, applyRemote]);

  // Leaving the page with unsaved typing: send it now.
  useEffect(() => {
    const onHide = () => {
      if (version.current !== savedVersion.current) {
        clearTimeout(timer.current);
        flushRef.current();
      }
    };
    window.addEventListener('pagehide', onHide);
    return () => {
      window.removeEventListener('pagehide', onHide);
      onHide();
    };
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface focus-within:border-foreground/40">
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-foreground-muted">
        <span className="inline-flex items-center gap-2">
          <span
            aria-hidden
            className={`size-1.5 rounded-full ${connected ? 'bg-success' : 'bg-foreground-muted/40'}`}
          />
          {connected ? 'Na żywo' : 'Łączenie…'}
        </span>
        <span role="status">
          {saveState === 'error' ? (
            <span className="text-foreground">
              Nie udało się zapisać — sprawdź połączenie, zapiszę przy następnej zmianie.
            </span>
          ) : saveState === 'saving' ? (
            'Zapisywanie…'
          ) : (
            'Zapisano'
          )}
        </span>
        {otherTyping && (
          <span className="inline-flex animate-fade items-center gap-2 font-medium text-accent">
            <span
              aria-hidden
              className="size-1.5 animate-pulse rounded-full bg-accent motion-reduce:animate-none"
            />
            {otherName} pisze…
          </span>
        )}
      </div>
    </div>
  );
}

const toolButton =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm text-foreground-muted transition-colors duration-150 hover:bg-surface-muted hover:text-foreground aria-pressed:bg-surface-muted aria-pressed:text-foreground focus-visible:outline-2 focus-visible:outline-accent';

function Toolbar({ editor }: { editor: Editor | null }) {
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            bold: e.isActive('bold'),
            italic: e.isActive('italic'),
            underline: e.isActive('underline'),
            heading: e.isActive('heading', { level: 2 }),
            bullet: e.isActive('bulletList'),
            ordered: e.isActive('orderedList'),
          }
        : null,
  });

  const buttons = [
    {
      label: 'Pogrubienie',
      text: <strong>B</strong>,
      active: state?.bold,
      run: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      label: 'Kursywa',
      text: <em className="font-serif text-base">I</em>,
      active: state?.italic,
      run: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      label: 'Podkreślenie',
      text: <span className="underline underline-offset-2">U</span>,
      active: state?.underline,
      run: () => editor?.chain().focus().toggleUnderline().run(),
    },
    {
      label: 'Nagłówek',
      text: <span className="font-serif text-base">H</span>,
      active: state?.heading,
      run: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: 'Lista punktowana',
      text: '•',
      active: state?.bullet,
      run: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      label: 'Lista numerowana',
      text: '1.',
      active: state?.ordered,
      run: () => editor?.chain().focus().toggleOrderedList().run(),
    },
  ];

  return (
    <div
      role="toolbar"
      aria-label="Formatowanie"
      className="flex flex-wrap gap-1 border-b border-border px-3 py-2 sm:px-5"
    >
      {buttons.map((b) => (
        <button
          key={b.label}
          type="button"
          aria-label={b.label}
          title={b.label}
          aria-pressed={Boolean(b.active)}
          disabled={!editor}
          onClick={b.run}
          className={toolButton}
        >
          {b.text}
        </button>
      ))}
    </div>
  );
}

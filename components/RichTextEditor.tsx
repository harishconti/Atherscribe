import React, { useEffect, useMemo } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// Toolbar Component
const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, disabled, isActive, title, children }: { onClick: () => void; disabled?: boolean; isActive: boolean; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded ${isActive ? 'is-active bg-cyan-100 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-200' : 'text-slate-600 dark:text-slate-300'} hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center gap-1 p-1 rounded-t-lg border-b bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h.5a2.5 2.5 0 002.5-2.5V6a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2v.75a1 1 0 01-1 1h-.5a.75.75 0 01-.75-.75V6.5a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5H8.25v.75a2.5 2.5 0 002.5 2.5h.5a.75.75 0 010 1.5h-.5a1 1 0 01-1-1v-.75a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2v.75a2.5 2.5 0 002.5 2.5h.5a.75.75 0 010 1.5H5.5a.75.75 0 01-.75-.75V10z" clipRule="evenodd" /></svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7.75 4.75a.75.75 0 00-1.5 0v1.5h-.25a.75.75 0 000 1.5h.25v4.5h-.25a.75.75 0 000 1.5h.25v1.5a.75.75 0 001.5 0v-1.5h3.5v1.5a.75.75 0 001.5 0v-1.5h.25a.75.75 0 000-1.5h-.25v-4.5h.25a.75.75 0 000-1.5h-.25V4.75a.75.75 0 00-1.5 0v1.5h-3.5V4.75zM9 8h2.25a.75.75 0 000-1.5H9v1.5z" /></svg>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.5 5.25a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H3.25a.75.75 0 01-.75-.75zm0 5a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H3.25a.75.75 0 01-.75-.75zm0 5a.75.75 0 01.75-.75h13.5a.75.75 0 010 1.5H3.25a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
      </ToolbarButton>
    </div>
  );
};

// Main Editor Component
interface RichTextEditorProps {
    content: string;
    onChange: (htmlContent: string) => void;
    editable?: boolean;
}

export const RichTextEditor = ({ content, onChange, editable = true }: RichTextEditorProps) => {
    // Memoize the entire static configuration to ensure it's stable across renders.
    const editorConfig = useMemo(() => {
        return {
            extensions: [
                StarterKit.configure({
                    // Explicitly enable extensions that provide commands for the toolbar
                    bold: {},
                    italic: {},
                    bulletList: {},
                    listItem: {}, // Required for bulletList

                    // Disable extensions we don't need for simplicity
                    strike: false,
                    code: false,
                    codeBlock: false,
                    blockquote: false,
                    horizontalRule: false,
                    heading: { levels: [2, 3] },
                }),
            ],
            editorProps: {
                attributes: {
                    class: 'prose dark:prose-invert max-w-none focus:outline-none p-4 w-full h-full min-h-[150px] bg-white dark:bg-slate-900/70 text-slate-700 dark:text-slate-300',
                },
            },
        };
    }, []);

    const editor = useEditor({
        ...editorConfig,
        content: content,
        editable: editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Effect to update the editor's editable status when the prop changes.
    useEffect(() => {
        if (editor && editor.isEditable !== editable) {
            editor.setEditable(editable);
        }
    }, [editable, editor]);

    // Effect to update the editor's content when the prop changes from its parent.
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Set content without triggering the onUpdate callback to prevent infinite loops.
            editor.commands.setContent(content, { emitUpdate: false });
        }
    }, [content, editor]);

    return (
        <div className={`rounded-lg border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-cyan-500 bg-white dark:bg-slate-900/70 ${!editable ? 'bg-slate-100 dark:bg-slate-800/60 cursor-not-allowed opacity-70' : ''}`}>
            {editable && <Toolbar editor={editor} />}
            <EditorContent editor={editor} />
        </div>
    );
};
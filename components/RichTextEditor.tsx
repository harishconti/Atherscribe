import React, { useState, useRef } from 'react';

// A simple toolbar for basic text formatting
const SimpleToolbar = ({ onFormat }: { onFormat: (format: 'bold' | 'italic') => void }) => {
  return (
    <div className="flex items-center gap-1 p-1 rounded-t-lg border-b bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700">
      <button
        type="button"
        onClick={() => onFormat('bold')}
        className="p-2 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
        title="Bold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h.5a2.5 2.5 0 002.5-2.5V6a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2v.75a1 1 0 01-1 1h-.5a.75.75 0 01-.75-.75V6.5a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5H8.25v.75a2.5 2.5 0 002.5 2.5h.5a.75.75 0 010 1.5h-.5a1 1 0 01-1-1v-.75a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2v.75a2.5 2.5 0 002.5 2.5h.5a.75.75 0 010 1.5H5.5a.75.75 0 01-.75-.75V10z" clipRule="evenodd" /></svg>
      </button>
    </div>
  );
};


interface RichTextEditorProps {
    content: string;
    onChange: (htmlContent: string) => void;
    editable?: boolean;
}

// A simplified, stable Rich Text Editor using contentEditable
export const RichTextEditor = ({ content, onChange, editable = true }: RichTextEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isInternalChange, setIsInternalChange] = useState(false);

    // Update the editor's content when the prop changes from the parent
    React.useEffect(() => {
        if (editorRef.current && content !== editorRef.current.innerHTML && !isInternalChange) {
            editorRef.current.innerHTML = content;
        }
        setIsInternalChange(false);
    }, [content]);
    
    const handleInput = () => {
        if (editorRef.current) {
            setIsInternalChange(true);
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleFormat = (format: 'bold' | 'italic') => {
        document.execCommand(format, false);
        editorRef.current?.focus();
        handleInput();
    };

    const editableClasses = 'prose dark:prose-invert max-w-none focus:outline-none p-4 w-full h-full min-h-[150px] bg-white dark:bg-slate-900/70 text-slate-700 dark:text-slate-300';
    const nonEditableClasses = 'bg-slate-100 dark:bg-slate-800/60 cursor-not-allowed opacity-70';

    return (
        <div className={`rounded-lg border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-cyan-500 bg-white dark:bg-slate-900/70 ${!editable ? nonEditableClasses : ''}`}>
            {editable && <SimpleToolbar onFormat={handleFormat} />}
            <div
                ref={editorRef}
                contentEditable={editable}
                onInput={handleInput}
                dangerouslySetInnerHTML={{ __html: content }}
                className={editableClasses}
            />
        </div>
    );
};
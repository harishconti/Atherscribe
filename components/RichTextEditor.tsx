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


interface AutosuggestTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  suggestions: string[];
  onValueChange: (value: string) => void;
  value: string;
}

export const AutosuggestTextarea: React.FC<AutosuggestTextareaProps> = ({ suggestions, value, onValueChange, ...props }) => {
  const [active, setActive] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    onValueChange(text);

    const caretPos = e.target.selectionStart;
    if (caretPos === null) {
      setActive(false);
      return;
    }

    const textBeforeCaret = text.substring(0, caretPos);
    const lastAt = textBeforeCaret.lastIndexOf('@');
    if (lastAt === -1) {
      setActive(false);
      return;
    }
    
    const precedingChar = textBeforeCaret[lastAt - 1];
    if (lastAt > 0 && precedingChar && !precedingChar.match(/[\s\n\t(]/)) {
        setActive(false);
        return;
    }

    const query = textBeforeCaret.substring(lastAt + 1);
    if (query.includes(' ') || query.includes('\n')) {
        setActive(false);
        return;
    }

    const matchingSuggestions = suggestions.filter(
      s => s.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredSuggestions(matchingSuggestions);
    setActive(matchingSuggestions.length > 0);
    setActiveIndex(0);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (active && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredSuggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        handleSelect(filteredSuggestions[activeIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setActive(false);
      }
    }
  };
  
  const handleSelect = (suggestion: string) => {
    if (!textareaRef.current) return;
    
    const text = String(value);
    const caretPos = textareaRef.current.selectionStart;
    const textBeforeCaret = text.substring(0, caretPos);
    
    const match = textBeforeCaret.match(/@\S*$/);
    if (!match || typeof match.index === 'undefined') {
        setActive(false);
        return;
    };
    
    const insertStartPos = match.index;
    
    const newValue = 
      text.substring(0, insertStartPos) + 
      `@[${suggestion}] ` + 
      text.substring(caretPos);
      
    onValueChange(newValue);
    setActive(false);
    
    setTimeout(() => {
        if(textareaRef.current) {
            const newCaretPos = insertStartPos + `@[${suggestion}] `.length;
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newCaretPos, newCaretPos);
        }
    }, 0);
  };

  return (
    <div className="relative">
      <textarea
        {...props}
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {active && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(suggestion); }}
              className={`p-2 cursor-pointer text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 ${index === activeIndex ? 'bg-slate-200 dark:bg-slate-600' : ''}`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
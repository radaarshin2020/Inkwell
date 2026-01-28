import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { Button } from '../components/ui/Button';
import { Editor } from '../components/Editor';
import { KnowledgeSidebar } from '../components/KnowledgeSidebar';
import { AIChatSidebar } from '../components/AIChatSidebar';

export function DocumentEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const documentId = id as Id<"documents">;
  
  const document = useQuery(api.documents.get, { id: documentId });
  const updateDocument = useMutation(api.documents.update);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showKnowledgeSidebar, setShowKnowledgeSidebar] = useState(true);
  const [showAIChatSidebar, setShowAIChatSidebar] = useState(true);
  const [contextSnippets, setContextSnippets] = useState<string[]>([]);
  
  // Track if we've initialized from the document
  const initialized = useRef(false);
  
  // Initialize state from document
  useEffect(() => {
    if (document && !initialized.current) {
      setTitle(document.title);
      setContent(document.content);
      setLastSaved(new Date(document.updatedAt));
      initialized.current = true;
    }
  }, [document]);
  
  // Auto-redirect to dashboard when document is deleted
  // This handles the case where a document is deleted while viewing it
  useEffect(() => {
    if (document === null && initialized.current) {
      // Document was loaded but is now gone (deleted)
      navigate('/dashboard', { replace: true });
    }
  }, [document, navigate]);
  
  // Debounced save
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const saveDocument = useCallback(async (newTitle?: string, newContent?: string) => {
    if (!documentId) return;
    
    setIsSaving(true);
    try {
      await updateDocument({
        id: documentId,
        ...(newTitle !== undefined && { title: newTitle }),
        ...(newContent !== undefined && { content: newContent }),
      });
      setLastSaved(new Date());
    } finally {
      setIsSaving(false);
    }
  }, [documentId, updateDocument]);
  
  const debouncedSave = useCallback((newTitle?: string, newContent?: string) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveDocument(newTitle, newContent);
    }, 1000);
  }, [saveDocument]);
  
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debouncedSave(newTitle, undefined);
  };
  
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    debouncedSave(undefined, newContent);
  };
  
  const handleInsertText = (text: string) => {
    const newContent = content + (content ? '\n\n' : '') + text;
    setContent(newContent);
    debouncedSave(undefined, newContent);
  };

  const handleAddToContext = (text: string) => {
    setContextSnippets((prev) => [...prev, text]);
  };

  const handleRemoveContext = (index: number) => {
    setContextSnippets((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearContext = () => {
    setContextSnippets([]);
  };
  
  const formatLastSaved = () => {
    if (!lastSaved) return '';
    
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    
    if (seconds < 10) return 'Just saved';
    if (seconds < 60) return `Saved ${seconds}s ago`;
    if (minutes < 60) return `Saved ${minutes}m ago`;
    
    return `Saved at ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  // Refresh "last saved" display
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);
  
  if (document === undefined) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="animate-pulse text-ink-400">Loading document...</div>
      </div>
    );
  }
  
  if (document === null) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl text-ink-700 mb-4">Document not found</h2>
          <Button
            onClick={() => navigate('/dashboard')}
          >
            Return to dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-cream-100">
      {/* Header */}
      <header className="bg-cream-50 border-b border-cream-200 px-4 py-3 flex items-center gap-4 flex-shrink-0">
        <Link
          to="/dashboard"
          className="p-2 text-ink-500 hover:text-ink-700 hover:bg-cream-200 rounded-lg transition-colors"
          title="Back to dashboard"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-ink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
          <span className="font-logo text-lg italic text-ink-700">Inkwell</span>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Untitled Document"
            className="bg-transparent font-serif text-xl text-ink-700 text-center border-none outline-none focus:ring-0 placeholder-ink-300 max-w-md w-full"
          />
        </div>
        
        <div className="flex items-center gap-3 text-sm text-ink-400">
          {isSaving ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </span>
          ) : (
            <span>{formatLastSaved()}</span>
          )}
          
          {/* Sidebar toggle buttons */}
          <div className="flex items-center gap-1 ml-2 border-l border-cream-300 pl-3">
            <Button
              onClick={() => setShowKnowledgeSidebar(!showKnowledgeSidebar)}
              variant="ghost"
              size="sm"
              className={`p-1.5 ${
                showKnowledgeSidebar 
                  ? 'text-accent-500 bg-accent-50 hover:bg-accent-100' 
                  : 'text-ink-400 hover:text-ink-600'
              }`}
              title={showKnowledgeSidebar ? 'Hide Knowledge sidebar' : 'Show Knowledge sidebar'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </Button>
            <Button
              onClick={() => setShowAIChatSidebar(!showAIChatSidebar)}
              variant="ghost"
              size="sm"
              className={`p-1.5 ${
                showAIChatSidebar 
                  ? 'text-accent-500 bg-accent-50 hover:bg-accent-100' 
                  : 'text-ink-400 hover:text-ink-600'
              }`}
              title={showAIChatSidebar ? 'Hide AI Assistant sidebar' : 'Show AI Assistant sidebar'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Knowledge */}
        <div 
          className={`flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
            showKnowledgeSidebar ? 'w-72 opacity-100' : 'w-0 opacity-0'
          }`}
        >
          <div className="w-72 h-full">
            <KnowledgeSidebar documentId={documentId} />
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 p-6 overflow-hidden transition-all duration-300 ease-in-out">
          <div className="h-full max-w-4xl mx-auto">
            <Editor
              content={content}
              onChange={handleContentChange}
              placeholder="Start writing your document..."
              onAddToContext={handleAddToContext}
            />
          </div>
        </div>

        {/* Right Sidebar - AI Chat */}
        <div 
          className={`flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
            showAIChatSidebar ? 'w-80 opacity-100' : 'w-0 opacity-0'
          }`}
        >
          <div className="w-80 h-full">
            <AIChatSidebar
              documentId={documentId}
              documentContent={content}
              onInsertText={handleInsertText}
              contextSnippets={contextSnippets}
              onRemoveContext={handleRemoveContext}
              onClearContext={handleClearContext}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


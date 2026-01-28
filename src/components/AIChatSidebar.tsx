import { useState, useRef, useEffect } from 'react';
import { useQuery, useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface AIChatSidebarProps {
  documentId: Id<"documents">;
  documentContent: string;
  onInsertText: (text: string) => void;
  contextSnippets?: string[];
  onRemoveContext?: (index: number) => void;
  onClearContext?: () => void;
}

export function AIChatSidebar({ 
  documentId, 
  documentContent, 
  onInsertText, 
  contextSnippets = [], 
  onRemoveContext, 
  onClearContext 
}: AIChatSidebarProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [docInstructions, setDocInstructions] = useState('');
  const [isSavingInstructions, setIsSavingInstructions] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = useQuery(api.messages.list, { documentId });
  const documentData = useQuery(api.documents.get, { id: documentId });
  const chat = useAction(api.ai.chat);
  const clearMessages = useMutation(api.messages.clear);
  const updateDocument = useMutation(api.documents.update);

  // Initialize document instructions from document data
  useEffect(() => {
    if (documentData) {
      setDocInstructions(documentData.aiSystemInstructions || '');
    }
  }, [documentData]);

  // Handle escape key and body scroll for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showInstructionsModal) {
        setShowInstructionsModal(false);
      }
    };

    if (showInstructionsModal) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showInstructionsModal]);

  const handleSaveInstructions = async () => {
    setIsSavingInstructions(true);
    setSaveSuccess(false);
    try {
      await updateDocument({
        id: documentId,
        aiSystemInstructions: docInstructions,
      });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowInstructionsModal(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to save instructions:', error);
    } finally {
      setIsSavingInstructions(false);
    }
  };

  const handleCloseModal = () => {
    // Reset to saved value if there were unsaved changes
    if (documentData) {
      setDocInstructions(documentData.aiSystemInstructions || '');
    }
    setShowInstructionsModal(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const hasInstructionChanges = documentData && docInstructions !== (documentData.aiSystemInstructions || '');
  const hasExistingInstructions = documentData?.aiSystemInstructions && documentData.aiSystemInstructions.trim().length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Build the message with context if any
    let userMessage = input.trim();
    if (contextSnippets.length > 0) {
      const contextText = contextSnippets
        .map((snippet, i) => `[Selected Text ${i + 1}]: "${snippet}"`)
        .join('\n');
      userMessage = `${contextText}\n\n${userMessage}`;
    }

    setInput('');
    setIsLoading(true);

    // Clear context after sending
    if (contextSnippets.length > 0 && onClearContext) {
      onClearContext();
    }

    try {
      await chat({
        documentId,
        userMessage,
        documentContent,
      });
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleClearChat = async () => {
    if (confirm('Clear all chat messages?')) {
      await clearMessages({ documentId });
    }
  };

  const handleInsert = (content: string) => {
    // Strip markdown code blocks if present
    let text = content;
    if (text.startsWith('```') && text.includes('\n')) {
      const lines = text.split('\n');
      lines.shift(); // Remove first line with ```
      if (lines[lines.length - 1] === '```') {
        lines.pop(); // Remove last ```
      }
      text = lines.join('\n');
    }
    onInsertText(text);
  };

  return (
    <>
      {/* Instructions Modal */}
      {showInstructionsModal && (
        <div
          className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <Card className="w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-100 text-accent-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a3 3 0 01-2.12.878H9.59a3 3 0 01-2.12-.878L5 14.5m14 0v4.375a2.625 2.625 0 01-2.625 2.625H7.625A2.625 2.625 0 015 18.875V14.5" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold text-ink-800">
                    AI Instructions
                  </h2>
                  <p className="text-xs text-ink-500">For this document only</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-ink-400 hover:text-ink-600 hover:bg-cream-200 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Description */}
            <p className="text-sm text-ink-500 mb-4">
              Add custom instructions to guide how the AI assistant responds when working on this document.
            </p>

            {/* Textarea */}
            <textarea
              value={docInstructions}
              onChange={(e) => setDocInstructions(e.target.value)}
              placeholder="Examples:&#10;• Write in a casual, friendly tone&#10;• Use British English spelling&#10;• Keep paragraphs short and concise&#10;• Avoid technical jargon"
              rows={5}
              className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-sm text-ink-700 placeholder-ink-300 resize-none focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent mb-4"
              autoFocus
            />

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleSaveInstructions}
                  disabled={!hasInstructionChanges || isSavingInstructions}
                >
                  {isSavingInstructions ? (
                    <>
                      <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Instructions'
                  )}
                </Button>
                <Button onClick={handleCloseModal} variant="secondary">
                  Cancel
                </Button>
              </div>
              {saveSuccess && (
                <span className="flex items-center gap-2 text-sm text-green-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </span>
              )}
            </div>
          </Card>
        </div>
      )}

      <div className="h-full flex flex-col bg-cream-50 border-l border-cream-200">
        {/* Header */}
        <div className="p-4 border-b border-cream-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-ink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
              <h2 className="font-logo text-lg italic text-ink-700">Inky</h2>
            </div>
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setShowInstructionsModal(true)}
                variant="ghost"
                size="sm"
                className={`p-1.5 ${hasExistingInstructions ? 'text-accent-500 bg-accent-50' : 'text-ink-400 hover:text-ink-600'}`}
                title="AI Instructions"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a3 3 0 01-2.12.878H9.59a3 3 0 01-2.12-.878L5 14.5" />
                </svg>
              </Button>
              {messages && messages.length > 0 && (
                <Button
                  onClick={handleClearChat}
                  variant="ghost"
                  size="sm"
                  className="p-1.5 text-ink-400 hover:text-ink-600"
                  title="Clear chat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
          <p className="text-xs text-ink-400">
            Ask AI to write or edit your document
          </p>
        </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages === undefined ? (
          // Loading
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-cream-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          // Empty state
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-cream-200 rounded-xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm text-ink-400">
                Start a conversation with AI
              </p>
              <p className="text-xs text-ink-300 mt-1">
                Try: "Write an introduction about..."
              </p>
            </div>
          </div>
        ) : (
          // Messages
          <>
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-ink-700 text-cream-50'
                      : 'bg-cream-200 text-ink-700'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.role === 'assistant' && (
                    <Button
                      onClick={() => handleInsert(message.content)}
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-xs text-accent-500 hover:text-accent-600 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Insert into document
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-cream-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-ink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-ink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-ink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-cream-200">
        {/* Context Snippets */}
        {contextSnippets.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {contextSnippets.map((snippet, index) => {
              // Get first two words for display
              const words = snippet.trim().split(/\s+/);
              const displayText = words.slice(0, 2).join(' ') + (words.length > 2 ? '...' : '');
              
              return (
                <div
                  key={index}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-accent-100 text-accent-700 rounded-lg text-xs font-medium"
                  title={snippet}
                >
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span className="truncate max-w-[80px]">{displayText}</span>
                  {onRemoveContext && (
                    <button
                      type="button"
                      onClick={() => onRemoveContext(index)}
                      className="p-0.5 hover:bg-accent-200 rounded transition-colors"
                      title="Remove context"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
            {contextSnippets.length > 1 && onClearContext && (
              <button
                type="button"
                onClick={onClearContext}
                className="px-2 py-1.5 text-xs text-ink-400 hover:text-ink-600 hover:bg-cream-200 rounded-lg transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={contextSnippets.length > 0 ? "Ask about the selected text..." : "Ask AI to help write..."}
            rows={2}
            className="flex-1 px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl text-ink-700 placeholder-ink-300 resize-none focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent text-sm"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="self-end p-3 aspect-square min-w-[44px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </div>
      </form>
      </div>
    </>
  );
}


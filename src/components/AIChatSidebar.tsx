import { useState, useRef, useEffect } from 'react';
import { useQuery, useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { Button } from './ui/Button';

interface AIChatSidebarProps {
  documentId: Id<"documents">;
  documentContent: string;
  onInsertText: (text: string) => void;
}

export function AIChatSidebar({ documentId, documentContent, onInsertText }: AIChatSidebarProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = useQuery(api.messages.list, { documentId });
  const chat = useAction(api.ai.chat);
  const clearMessages = useMutation(api.messages.clear);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

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
    <div className="h-full flex flex-col bg-cream-50 border-l border-cream-200">
      {/* Header */}
      <div className="p-4 border-b border-cream-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-lg font-semibold text-ink-700">AI Assistant</h2>
          {messages && messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-1.5 text-ink-400 hover:text-ink-600 hover:bg-cream-200 rounded-lg transition-colors"
              title="Clear chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
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
                    <button
                      onClick={() => handleInsert(message.content)}
                      className="mt-2 text-xs text-accent-500 hover:text-accent-600 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Insert into document
                    </button>
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
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to help write..."
            rows={2}
            className="flex-1 px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl text-ink-700 placeholder-ink-300 resize-none focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent text-sm"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </div>
      </form>
    </div>
  );
}


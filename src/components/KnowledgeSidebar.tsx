import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';

interface KnowledgeSidebarProps {
  documentId: Id<"documents">;
}

export function KnowledgeSidebar({ documentId }: KnowledgeSidebarProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<Id<"knowledge"> | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const knowledgeItems = useQuery(api.knowledge.list, { documentId });
  const createKnowledge = useMutation(api.knowledge.create);
  const updateKnowledge = useMutation(api.knowledge.update);
  const deleteKnowledge = useMutation(api.knowledge.remove);

  const handleAdd = async () => {
    if (!title.trim() || !content.trim()) return;
    await createKnowledge({
      documentId,
      title: title.trim(),
      content: content.trim(),
    });
    setTitle('');
    setContent('');
    setIsAdding(false);
  };

  const handleUpdate = async () => {
    if (!editingId || !title.trim() || !content.trim()) return;
    await updateKnowledge({
      id: editingId,
      title: title.trim(),
      content: content.trim(),
    });
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  const handleEdit = (item: { _id: Id<"knowledge">; title: string; content: string }) => {
    setEditingId(item._id);
    setTitle(item.title);
    setContent(item.content);
    setIsAdding(false);
  };

  const handleDelete = async (id: Id<"knowledge">) => {
    if (confirm('Delete this knowledge item?')) {
      await deleteKnowledge({ id });
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  return (
    <div className="h-full flex flex-col bg-cream-50 border-r border-cream-200">
      {/* Header */}
      <div className="p-4 border-b border-cream-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-serif text-lg font-semibold text-ink-700">Knowledge</h2>
          {!isAdding && !editingId && (
            <button
              onClick={() => setIsAdding(true)}
              className="p-1.5 text-ink-500 hover:text-ink-700 hover:bg-cream-200 rounded-lg transition-colors"
              title="Add knowledge"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-xs text-ink-400">
          Add reference documents for AI context
        </p>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="p-4 border-b border-cream-200 space-y-3">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm"
          />
          <Textarea
            placeholder="Paste your reference content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={editingId ? handleUpdate : handleAdd}
              disabled={!title.trim() || !content.trim()}
            >
              {editingId ? 'Update' : 'Add'}
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Knowledge List */}
      <div className="flex-1 overflow-y-auto">
        {knowledgeItems === undefined ? (
          // Loading
          <div className="p-4 space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-cream-200 rounded w-24 mb-2" />
                <div className="h-3 bg-cream-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : knowledgeItems.length === 0 && !isAdding ? (
          // Empty state
          <div className="p-4 text-center">
            <div className="w-12 h-12 bg-cream-200 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-sm text-ink-400 mb-3">
              No knowledge added yet
            </p>
            <Button size="sm" variant="secondary" onClick={() => setIsAdding(true)}>
              Add Knowledge
            </Button>
          </div>
        ) : (
          // Knowledge items
          <div className="p-2 space-y-2">
            {knowledgeItems.map((item) => (
              <div
                key={item._id}
                className={`p-3 rounded-xl border transition-colors group ${
                  editingId === item._id
                    ? 'bg-accent-400/10 border-accent-400'
                    : 'bg-cream-100 border-cream-200 hover:border-cream-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-sm text-ink-700 truncate flex-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 text-ink-400 hover:text-ink-600 hover:bg-cream-200 rounded"
                      title="Edit"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1 text-ink-400 hover:text-red-500 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-ink-400 mt-1 line-clamp-2">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


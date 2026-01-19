import { useNavigate } from 'react-router-dom';
import { Card } from './ui/Card';
import type { Id } from '../../convex/_generated/dataModel';

interface DocumentCardProps {
  id: Id<"documents">;
  title: string;
  updatedAt: number;
  onDelete: (id: Id<"documents">) => void;
}

export function DocumentCard({ id, title, updatedAt, onDelete }: DocumentCardProps) {
  const navigate = useNavigate();
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this document?')) {
      onDelete(id);
    }
  };

  return (
    <Card 
      hover 
      className="p-6 group"
      onClick={() => navigate(`/document/${id}`)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cream-200 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-ink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-serif text-lg font-medium text-ink-700 truncate">
              {title || 'Untitled Document'}
            </h3>
          </div>
          <p className="text-sm text-ink-400">
            Last edited {formatDate(updatedAt)}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="p-2 text-ink-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          title="Delete document"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </Card>
  );
}


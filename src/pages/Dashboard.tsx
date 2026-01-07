import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { useAuthActions } from '@convex-dev/auth/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Button } from '../components/ui/Button';
import { DocumentCard } from '../components/DocumentCard';

export function Dashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuthActions();
  const documents = useQuery(api.documents.list);
  const createDocument = useMutation(api.documents.create);
  const deleteDocument = useMutation(api.documents.remove);

  const handleCreateDocument = async () => {
    const id = await createDocument({});
    navigate(`/document/${id}`);
  };

  const handleDeleteDocument = async (id: Id<"documents">) => {
    await deleteDocument({ id });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-cream-50 border-b border-cream-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8 text-ink-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
            <span className="font-serif text-2xl font-semibold text-ink-800">Inkwell</span>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleCreateDocument}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Document
            </Button>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="font-serif text-3xl font-semibold text-ink-800 mb-2">
            Your Documents
          </h1>
          <p className="text-ink-500">
            Create, edit, and manage your documents with AI assistance
          </p>
        </div>

        {documents === undefined ? (
          // Loading state
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-cream-50 rounded-2xl p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-cream-200 rounded-xl" />
                  <div className="h-5 bg-cream-200 rounded-lg w-32" />
                </div>
                <div className="h-4 bg-cream-200 rounded-lg w-24" />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          // Empty state
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-cream-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-ink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-semibold text-ink-700 mb-3">
              No documents yet
            </h2>
            <p className="text-ink-500 mb-8 max-w-md mx-auto">
              Create your first document and start writing with AI-powered assistance
            </p>
            <Button size="lg" onClick={handleCreateDocument}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Document
            </Button>
          </div>
        ) : (
          // Documents grid
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard
                key={doc._id}
                id={doc._id}
                title={doc.title}
                updatedAt={doc.updatedAt}
                onDelete={handleDeleteDocument}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


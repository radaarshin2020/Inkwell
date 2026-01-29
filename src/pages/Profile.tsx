import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { AccountDropdown } from '../components/AccountDropdown';

export function Profile() {
  const navigate = useNavigate();
  const user = useQuery(api.users.getCurrentUser);
  const userSettings = useQuery(api.users.getUserSettings);
  const updateProfile = useMutation(api.users.updateProfile);
  const updateAIInstructions = useMutation(api.users.updateAIInstructions);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // AI Instructions state
  const [aiInstructions, setAiInstructions] = useState('');
  const [isSavingAI, setIsSavingAI] = useState(false);
  const [saveAISuccess, setSaveAISuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (userSettings) {
      setAiInstructions(userSettings.aiSystemInstructions || '');
    }
  }, [userSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = user && (name.trim() !== user.name || email.trim() !== user.email);
  const hasAIChanges = userSettings !== undefined && aiInstructions !== (userSettings?.aiSystemInstructions || '');

  const handleSaveAIInstructions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAI(true);
    setSaveAISuccess(false);

    try {
      await updateAIInstructions({ aiSystemInstructions: aiInstructions });
      setSaveAISuccess(true);
      setTimeout(() => setSaveAISuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update AI instructions:', error);
    } finally {
      setIsSavingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-cream-50 border-b border-cream-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-ink-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
            <span className="font-logo text-xl sm:text-2xl italic text-ink-800">Inkwell</span>
          </Link>
          <AccountDropdown />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="flex items-center gap-2 text-ink-500 hover:text-ink-700 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Button>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ink-800">
            Profile Settings
          </h1>
          <p className="text-ink-500 mt-2">
            Manage your account details and preferences
          </p>
        </div>

        {user === undefined ? (
          <div className="bg-cream-50 rounded-2xl p-8 animate-pulse">
            <div className="h-6 bg-cream-200 rounded-lg w-24 mb-6" />
            <div className="h-12 bg-cream-200 rounded-xl mb-4" />
            <div className="h-6 bg-cream-200 rounded-lg w-24 mb-6" />
            <div className="h-12 bg-cream-200 rounded-xl" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-cream-50 rounded-2xl p-4 sm:p-8 shadow-soft">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-cream-200">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-ink-700 text-cream-50 rounded-full flex items-center justify-center text-lg sm:text-xl font-medium">
                {name
                  ? name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : user?.email?.slice(0, 2).toUpperCase() ?? '?'}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="font-medium text-ink-800 text-base sm:text-lg">
                  {name || email}
                </h2>
                <p className="text-ink-500 text-sm sm:text-base">{email}</p>
              </div>
            </div>

            <div className="space-y-6">
              <Input
                id="name"
                label="Display Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />

              <Input
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-cream-200">
              <Button type="submit" disabled={!hasChanges || isSaving} className="w-full sm:w-auto">
                {isSaving ? (
                  <>
                    <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>

              {saveSuccess && (
                <span className="flex items-center gap-2 text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Changes saved
                </span>
              )}
            </div>
          </form>
        )}

        {/* AI Instructions Section */}
        <div className="mt-8">
          <h2 className="font-serif text-2xl font-semibold text-ink-800 mb-2">
            AI Assistant Settings
          </h2>
          <p className="text-ink-500 mb-6">
            Set global instructions that guide how the AI assistant responds across all your documents
          </p>

          <form onSubmit={handleSaveAIInstructions} className="bg-cream-50 rounded-2xl p-4 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-cream-200">
              <div className="w-12 h-12 bg-accent-100 text-accent-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a3 3 0 01-2.12.878H9.59a3 3 0 01-2.12-.878L5 14.5m14 0v4.375a2.625 2.625 0 01-2.625 2.625H7.625A2.625 2.625 0 015 18.875V14.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-ink-800">
                  Global AI Instructions
                </h3>
                <p className="text-sm text-ink-500">
                  These instructions apply to all documents
                </p>
              </div>
            </div>

            <Textarea
              id="aiInstructions"
              value={aiInstructions}
              onChange={(e) => setAiInstructions(e.target.value)}
              placeholder="Enter instructions for the AI assistant, such as:&#10;• Use a formal, professional tone&#10;• Write in British English&#10;• Keep responses concise and to the point&#10;• Avoid using jargon"
              rows={6}
              className="mb-4"
            />

            <p className="text-xs text-ink-400 mb-6">
              Tip: Include tone preferences, writing style guidelines, or specific formatting requirements.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <Button type="submit" disabled={!hasAIChanges || isSavingAI} className="w-full sm:w-auto">
                {isSavingAI ? (
                  <>
                    <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Instructions'
                )}
              </Button>

              {saveAISuccess && (
                <span className="flex items-center gap-2 text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Instructions saved
                </span>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

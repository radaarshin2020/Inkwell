import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AccountDropdown } from '../components/AccountDropdown';

export function Profile() {
  const navigate = useNavigate();
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

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

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-cream-50 border-b border-cream-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <svg className="w-8 h-8 text-ink-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
            <span className="font-serif text-2xl font-semibold text-ink-800">Inkwell</span>
          </Link>
          <AccountDropdown />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-8 py-12">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-ink-500 hover:text-ink-700 transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="font-serif text-3xl font-semibold text-ink-800">
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
          <form onSubmit={handleSubmit} className="bg-cream-50 rounded-2xl p-8 shadow-soft">
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-cream-200">
              <div className="w-16 h-16 bg-ink-700 text-cream-50 rounded-full flex items-center justify-center text-xl font-medium">
                {name
                  ? name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : user.email?.slice(0, 2).toUpperCase() ?? '?'}
              </div>
              <div>
                <h2 className="font-medium text-ink-800 text-lg">
                  {name || email}
                </h2>
                <p className="text-ink-500">{email}</p>
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

            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-cream-200">
              <Button type="submit" disabled={!hasChanges || isSaving}>
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
      </main>
    </div>
  );
}

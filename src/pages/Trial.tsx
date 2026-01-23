import { useAuthActions } from '@convex-dev/auth/react';
import { TrialPopup } from '../components/TrialPopup';

interface TrialProps {
  userEmail: string;
  onSuccess: () => void;
}

export function Trial({ userEmail, onSuccess }: TrialProps) {
  const { signOut } = useAuthActions();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-cream-100">
      <TrialPopup userEmail={userEmail} onSuccess={onSuccess} />
      
      {/* Logout link positioned at bottom of screen */}
      <div className="fixed bottom-6 left-0 right-0 text-center z-50">
        <p className="text-sm text-ink-400">
          Logged in with the wrong account?{' '}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-accent-600 hover:text-accent-700 underline"
          >
            Log out
          </Button>
        </p>
      </div>
    </div>
  );
}

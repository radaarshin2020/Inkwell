import { useState, useCallback, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ConvexReactClient, useConvexAuth, useQuery } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { api } from '../convex/_generated/api';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { DocumentEditor } from './pages/DocumentEditor';
import { Profile } from './pages/Profile';
import { Trial } from './pages/Trial';
import { CheckoutSuccess } from './pages/CheckoutSuccess';
import { StyleGuide } from './pages/StyleGuide';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <div className="flex items-center gap-3 text-ink-500">
        <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="font-serif text-lg">Loading...</span>
      </div>
    </div>
  );
}

function VerifyingSubscriptionScreen() {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 text-ink-500 mb-4">
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="font-serif text-lg">Verifying subscription...</span>
        </div>
        <p className="text-sm text-ink-400">This may take a few moments</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);
  const subscriptionStatus = useQuery(api.subscriptions.getSubscriptionStatus);
  const [isVerifyingSubscription, setIsVerifyingSubscription] = useState(false);
  const [showTrial, setShowTrial] = useState(true);
  const pollCountRef = useRef(0);
  const maxPolls = 30; // Poll for up to 30 seconds (30 * 1000ms)

  // Effect to check subscription status during verification
  useEffect(() => {
    if (isVerifyingSubscription && subscriptionStatus?.hasActiveSubscription) {
      // Subscription confirmed! Stop verifying and redirect to dashboard
      setIsVerifyingSubscription(false);
      setShowTrial(false);
      navigate('/dashboard', { replace: true });
    }
  }, [isVerifyingSubscription, subscriptionStatus, navigate]);

  // Polling effect for subscription verification
  useEffect(() => {
    if (!isVerifyingSubscription) {
      pollCountRef.current = 0;
      return;
    }

    const pollInterval = setInterval(() => {
      pollCountRef.current += 1;
      
      // If max polls reached, stop verifying and show trial again
      if (pollCountRef.current >= maxPolls) {
        setIsVerifyingSubscription(false);
        // The subscription status query will have the latest status
        // If still no subscription, Trial page will show
      }
    }, 1000);

    return () => clearInterval(pollInterval);
  }, [isVerifyingSubscription]);

  const handleSubscriptionSuccess = useCallback(() => {
    // Start verifying subscription - wait for webhook to process
    setIsVerifyingSubscription(true);
    pollCountRef.current = 0;
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Wait for user and subscription data to load
  if (user === undefined || subscriptionStatus === undefined) {
    return <LoadingScreen />;
  }

  // Show verifying screen while waiting for webhook
  if (isVerifyingSubscription) {
    return <VerifyingSubscriptionScreen />;
  }

  // Check if user has an active subscription
  const hasActiveSubscription = subscriptionStatus?.hasActiveSubscription ?? false;

  // Show trial page if no active subscription
  if (!hasActiveSubscription && showTrial && user?.email) {
    return (
      <Trial 
        userEmail={user.email} 
        onSuccess={handleSubscriptionSuccess}
      />
    );
  }

  // User has active subscription, show the protected content
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();
  // Track if we've rendered children to avoid unmounting during auth transitions
  const hasRenderedRef = useRef(false);
  
  // Only show loading screen on initial load, not during auth transitions
  // This prevents the Auth form from unmounting and losing form data
  if (isLoading && !hasRenderedRef.current) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="flex items-center gap-3 text-ink-500">
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="font-serif text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Mark that we've rendered children at least once
  hasRenderedRef.current = true;
  
  return <>{children}</>;
}

function App() {
  return (
    <ConvexAuthProvider client={convex}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/document/:id"
            element={
              <ProtectedRoute>
                <DocumentEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/style-guide" element={<StyleGuide />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ConvexAuthProvider>
  );
}

export default App;

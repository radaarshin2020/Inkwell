import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function CheckoutSuccess() {
  const navigate = useNavigate();
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const subscriptionStatus = useQuery(api.subscriptions.getSubscriptionStatus);
  const [pollCount, setPollCount] = useState(0);
  const maxPolls = 30; // Poll for up to 30 seconds
  const hasRedirectedRef = useRef(false);

  // Poll for subscription status
  useEffect(() => {
    if (pollCount >= maxPolls) {
      // Timeout - redirect to dashboard anyway, let ProtectedRoute handle it
      if (!hasRedirectedRef.current) {
        hasRedirectedRef.current = true;
        navigate('/dashboard', { replace: true });
      }
      return;
    }

    const timer = setTimeout(() => {
      setPollCount(prev => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pollCount, navigate]);

  // Check subscription status and redirect when confirmed
  useEffect(() => {
    if (hasRedirectedRef.current) return;
    
    if (subscriptionStatus?.hasActiveSubscription) {
      hasRedirectedRef.current = true;
      navigate('/dashboard', { replace: true });
    }
  }, [subscriptionStatus, navigate]);

  // If not authenticated, redirect to auth
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="font-serif text-2xl font-semibold text-ink-800 mb-3">
          Payment Successful!
        </h1>
        
        <p className="text-ink-500 mb-6">
          Thank you for subscribing to Inkwell. We're setting up your account...
        </p>

        <div className="flex items-center justify-center gap-3 text-ink-500">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm">Verifying subscription...</span>
        </div>

        <p className="text-xs text-ink-400 mt-4">
          This may take a few moments
        </p>
      </div>
    </div>
  );
}

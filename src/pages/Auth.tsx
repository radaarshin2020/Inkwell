import { useState, useRef, useEffect, useCallback } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuthActions } from '@convex-dev/auth/react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export function Auth() {
  const [searchParams] = useSearchParams();
  const { signIn } = useAuthActions();
  
  // Use refs to track form values to prevent loss during re-renders
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  
  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);
  
  const [isSignUp, setIsSignUp] = useState(() => searchParams.get('mode') === 'signup');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    
    // Get values from refs to ensure we have the latest values
    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const name = nameRef.current?.value || '';
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.set('email', email);
      formData.set('password', password);
      formData.set('flow', isSignUp ? 'signUp' : 'signIn');
      if (isSignUp && name) {
        formData.set('name', name);
      }
      
      const result = await signIn('password', formData);
      
      // Only update state if still mounted
      if (!isMountedRef.current) return;
      
      // If signIn returns a redirect URL, we might need to handle it
      // Otherwise, PublicRoute will auto-redirect when auth state updates
      if (result?.redirect) {
        // Handle any redirect if provided
        window.location.href = result.redirect.toString();
      }
      // Don't navigate manually - let PublicRoute handle it when auth state changes
    } catch (err: unknown) {
      // Only update state if still mounted
      if (!isMountedRef.current) return;
      
      console.error('Auth error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes('Invalid password') || errorMessage.includes('Could not verify')) {
        setError('Invalid email or password.');
      } else if (errorMessage.includes('already exists') || errorMessage.includes('already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(isSignUp 
          ? 'Could not create account. Please try again.' 
          : 'Invalid email or password.'
        );
      }
    } finally {
      // Only update state if still mounted
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [isSignUp, signIn]);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header */}
      <header className="py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <nav className="max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-ink-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
            <span className="font-logo text-xl sm:text-2xl italic text-ink-800">Inkwell</span>
          </Link>
        </nav>
      </header>

      {/* Auth Form */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <Card className="w-full max-w-md p-5 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ink-800 mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-ink-500">
              {isSignUp 
                ? 'Start writing with AI-powered assistance' 
                : 'Sign in to continue to your documents'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Use key prop to ensure React correctly identifies each input during mode switches */}
            {/* Always render name field container to maintain stable DOM structure */}
            <div key="name-container" className={isSignUp ? '' : 'hidden'}>
              <Input
                ref={nameRef}
                id="name"
                label="Name"
                type="text"
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
            <Input
              key="email"
              ref={emailRef}
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <Input
              key="password"
              ref={passwordRef}
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-accent-500 hover:text-accent-600 font-medium transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}


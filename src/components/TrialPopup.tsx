import { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { PolarCheckout } from './PolarCheckout';

interface TrialPopupProps {
  userEmail: string;
  onSuccess: () => void;
}

export function TrialPopup({ userEmail, onSuccess }: TrialPopupProps) {
  const [showCheckout, setShowCheckout] = useState(false);

  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'AI-Powered Writing Assistance',
      description: 'Get intelligent suggestions and help with your writing in real-time',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Unlimited Documents',
      description: 'Create and manage as many documents as you need',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: 'Knowledge Base Integration',
      description: 'Build a personal knowledge base to enhance your AI assistant',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      title: 'Priority Support',
      description: 'Get help when you need it with dedicated support',
    },
  ];

  const handleStartTrial = () => {
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    onSuccess();
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
  };

  return (
    <>
      <div className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
        <Card className="w-full max-w-lg p-5 sm:p-8 animate-in fade-in zoom-in duration-200 my-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-accent-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-ink-800 mb-2">
              Unlock the Full Power of Inkwell
            </h2>
            <p className="text-ink-500 text-sm sm:text-base">
              Start your free trial today and experience AI-powered writing like never before
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-cream-200 rounded-xl flex items-center justify-center flex-shrink-0 text-ink-600">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-medium text-ink-700 text-sm sm:text-base">{benefit.title}</h3>
                  <p className="text-xs sm:text-sm text-ink-500">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="bg-cream-100 rounded-xl p-3 sm:p-4 mb-5 sm:mb-6 text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold text-ink-800">$19</span>
              <span className="text-ink-500">/month</span>
            </div>
            <p className="text-sm text-ink-500 mt-1">
              Cancel anytime. No questions asked.
            </p>
          </div>

          {/* CTA Button */}
          <Button 
            onClick={handleStartTrial} 
            className="w-full"
            size="lg"
          >
            Start free trial
          </Button>

          <p className="text-xs text-ink-400 text-center mt-4">
            By starting your trial, you agree to our Terms of Service and Privacy Policy
          </p>
        </Card>
      </div>

      {/* Polar Checkout Modal */}
      {showCheckout && (
        <PolarCheckout
          userEmail={userEmail}
          onSuccess={handleCheckoutSuccess}
          onClose={handleCheckoutClose}
        />
      )}
    </>
  );
}

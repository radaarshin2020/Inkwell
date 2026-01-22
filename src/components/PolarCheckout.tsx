import { useEffect, useRef, useCallback } from 'react';
import { PolarEmbedCheckout } from '@polar-sh/checkout/embed';

interface PolarCheckoutProps {
  userEmail: string;
  onSuccess: () => void;
  onClose: () => void;
}

const CHECKOUT_LINK = 'https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_xbMjlzArtAPZg6WdZ8rYyJhF1gl7rVgz6Q0zv2a3UIo/redirect';

export function PolarCheckout({ userEmail, onSuccess, onClose }: PolarCheckoutProps) {
  const checkoutRef = useRef<ReturnType<typeof PolarEmbedCheckout.create> | null>(null);
  const isInitializedRef = useRef(false);

  const handleSuccess = useCallback(() => {
    onSuccess();
  }, [onSuccess]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const initCheckout = async () => {
      try {
        // Build checkout URL with customer email prefilled and success URL
        const checkoutUrl = new URL(CHECKOUT_LINK);
        checkoutUrl.searchParams.set('customer_email', userEmail);
        
        // Set the success URL to redirect back to our app after checkout
        const successUrl = `${window.location.origin}/checkout/success`;
        checkoutUrl.searchParams.set('success_url', successUrl);
        
        // Create the embedded checkout
        const checkout = await PolarEmbedCheckout.create(checkoutUrl.toString(), 'light');
        checkoutRef.current = checkout;

        // Listen for success event (may fire before redirect)
        checkout.addEventListener('success', (event: CustomEvent) => {
          console.log('Polar checkout success event received');
          event.preventDefault();
          handleSuccess();
        });

        // Listen for confirmation event (alternative success event)
        checkout.addEventListener('confirmation', () => {
          console.log('Polar checkout confirmation event received');
          handleSuccess();
        });

        // Listen for close event
        checkout.addEventListener('close', () => {
          handleClose();
        });
      } catch (error) {
        console.error('Failed to open Polar checkout:', error);
        handleClose();
      }
    };

    initCheckout();

    // Cleanup on unmount
    return () => {
      if (checkoutRef.current) {
        try {
          checkoutRef.current.close();
        } catch {
          // Checkout might already be closed
        }
        checkoutRef.current = null;
      }
    };
  }, [userEmail, handleSuccess, handleClose]);

  // This component doesn't render anything visible - the checkout is rendered by Polar's SDK
  return null;
}

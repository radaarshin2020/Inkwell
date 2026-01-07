import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', hover = false, children, ...props }, ref) => {
    const hoverStyles = hover 
      ? 'cursor-pointer hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200' 
      : '';
    
    return (
      <div
        ref={ref}
        className={`bg-cream-50 rounded-2xl shadow-soft ${hoverStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';


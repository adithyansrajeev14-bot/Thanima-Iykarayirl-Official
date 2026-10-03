import React from 'react';

interface LearnerBadgeProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const LearnerBadge: React.FC<LearnerBadgeProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-base rounded border-2',
    md: 'w-10 h-10 text-2xl rounded-md border-2',
    lg: 'w-14 h-14 text-3xl rounded-lg border-[3px]',
    xl: 'w-20 h-20 text-4xl rounded-xl border-4'
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-black bg-white border-red-600 text-red-600 shadow-xs select-none shrink-0 ${sizeClasses[size]} ${className}`}
      style={{
        fontFamily: "'Arial Black', 'Helvetica Neue', Impact, sans-serif",
      }}
      title="Motor Vehicles Department Official Learner Sign"
      aria-label="Official Motor Driving School Learner Symbol"
    >
      L
    </div>
  );
};

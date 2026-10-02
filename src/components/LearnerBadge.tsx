import React from 'react';

interface LearnerBadgeProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const LearnerBadge: React.FC<LearnerBadgeProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xl border-2',
    md: 'w-11 h-11 text-2xl border-[3px]',
    lg: 'w-16 h-16 text-3xl border-4',
    xl: 'w-24 h-24 text-5xl border-[5px]'
  };

  return (
    <div
      className={`inline-flex items-center justify-center font-black rounded-full bg-white border-blue-600 text-red-600 shadow-md select-none flex-shrink-0 transition-transform hover:scale-105 ${sizeClasses[size]} ${className}`}
      style={{
        fontFamily: "'Arial Black', 'Impact', sans-serif",
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25), 0 2px 6px rgba(37, 99, 235, 0.3)'
      }}
      title="Motor Driving School Official Learner's Mark"
    >
      L
    </div>
  );
};

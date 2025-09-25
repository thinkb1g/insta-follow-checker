
import React, { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
};

export default Card;

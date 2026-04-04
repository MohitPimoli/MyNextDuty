import React from 'react';
import './style.scss';

const Paper = ({ 
  children, 
  className = '', 
  elevation = 1, 
  padding = 'medium',
  ...props 
}) => {
  const paperClasses = [
    'paper',
    `paper--elevation-${elevation}`,
    `paper--padding-${padding}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={paperClasses} {...props}>
      {children}
    </div>
  );
};

export default Paper;
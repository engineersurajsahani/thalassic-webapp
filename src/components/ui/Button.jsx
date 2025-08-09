import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  type = 'button',
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer';
  
  const variants = {
    primary: 'bg-[linear-gradient(127deg,#49848c_0%,_#284247_100%)] text-white hover:opacity-90 focus:ring-blue-500',
    secondary: 'bg-button-1 text-button-1 hover:bg-opacity-80 focus:ring-green-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm sm:px-4 sm:py-2',
    medium: 'px-4 py-2 text-base sm:px-5 sm:py-2.5',
    large: 'px-5 py-2.5 text-lg sm:px-6 sm:py-3',
  };
  
  const buttonClasses = `
    ${baseClasses} 
    ${variants?.[variant]} 
    ${sizes?.[size]} 
    ${fullWidth ? 'w-full' : ''} 
    ${disabled ? 'cursor-not-allowed opacity-50' : ''}
    ${className}
  `?.trim()?.replace(/\s+/g, ' ');
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes?.node,
  onClick: PropTypes?.func,
  variant: PropTypes?.oneOf(['primary', 'secondary', 'outline']),
  size: PropTypes?.oneOf(['small', 'medium', 'large']),
  disabled: PropTypes?.bool,
  type: PropTypes?.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes?.bool,
  className: PropTypes?.string,
};

export default Button;

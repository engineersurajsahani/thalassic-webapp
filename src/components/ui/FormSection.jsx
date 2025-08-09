import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const FormSection = ({ 
  title, 
  icon, 
  children, 
  bgColor = 'bg-white', 
  showUpload = false, 
  onUpload,
  className = ''
}) => {
  return (
    <div className={`${bgColor} rounded-[24px] p-6 sm:p-8 lg:p-[40px] ${className}`}>
      <div className="flex items-center justify-between mb-6 lg:mb-8">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-8 h-8 flex items-center justify-center">
              {typeof icon === 'string' ? (
                <img src={icon} alt={title} className="w-6 h-6" />
              ) : (
                icon
              )}
            </div>
          )}
          <h2 className="text-[20px] sm:text-[22px] lg:text-[24px] font-inter font-bold leading-[26px] lg:leading-[30px] text-global-2">
            {title}
          </h2>
        </div>
        {showUpload && (
          <Button
            variant="secondary"
            size="small"
            onClick={onUpload}
            className="!px-4 !py-2 !text-sm"
          >
            📤 Upload
          </Button>
        )}
      </div>
      {children}
    </div>
  );
};

FormSection.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  bgColor: PropTypes.string,
  showUpload: PropTypes.bool,
  onUpload: PropTypes.func,
  className: PropTypes.string,
};

export default FormSection;

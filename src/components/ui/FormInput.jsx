import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = 'text', 
  placeholder = '', 
  required = false,
  className = '',
  disabled = false,
  rows = 3
}) => {
  const inputClasses = `
    w-full px-3 py-2 border border-gray-300 rounded-md 
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={inputClasses}
        />
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClasses}
        />
      )}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
};

export default FormInput;

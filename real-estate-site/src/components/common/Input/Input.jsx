import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Input.css';

/**
 * Input Component
 * Modern input field with variants and states
 */
const Input = ({
    type = 'text',
    value,
    onChange,
    placeholder,
    label,
    error,
    disabled = false,
    fullWidth = false,
    size = 'md',
    icon,
    iconPosition = 'left',
    className,
    ...props
}) => {
    const inputClasses = classNames(
        'input-modern',
        `input-${size}`,
        {
            'input-error': error,
            'input-disabled': disabled,
            'input-full-width': fullWidth,
            'input-with-icon': icon,
            [`input-icon-${iconPosition}`]: icon,
        },
        className
    );

    return (
        <div className="input-wrapper">
            {label && (
                <label className="input-label">
                    {label}
                </label>
            )}
            <div className="input-container">
                {icon && iconPosition === 'left' && (
                    <span className="input-icon input-icon-left">{icon}</span>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={inputClasses}
                    {...props}
                />
                {icon && iconPosition === 'right' && (
                    <span className="input-icon input-icon-right">{icon}</span>
                )}
            </div>
            {error && (
                <span className="input-error-message">{error}</span>
            )}
        </div>
    );
};

Input.propTypes = {
    type: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.string,
    disabled: PropTypes.bool,
    fullWidth: PropTypes.bool,
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    className: PropTypes.string,
};

export default Input;

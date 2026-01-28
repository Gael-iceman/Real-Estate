import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Badge.css';

/**
 * Badge Component
 * Small label/tag for status, categories, etc.
 */
const Badge = ({
    children,
    variant = 'primary',
    size = 'md',
    rounded = false,
    icon,
    className,
    ...props
}) => {
    const badgeClasses = classNames(
        'badge-modern',
        `badge-${variant}`,
        `badge-${size}`,
        {
            'badge-rounded': rounded,
            'badge-icon-only': !children && icon,
        },
        className
    );

    return (
        <span className={badgeClasses} {...props}>
            {icon && <span className="badge-icon">{icon}</span>}
            {children && <span className="badge-text">{children}</span>}
        </span>
    );
};

Badge.propTypes = {
    children: PropTypes.node,
    variant: PropTypes.oneOf([
        'primary',
        'secondary',
        'success',
        'warning',
        'error',
        'info',
        'neutral',
        'accent',
    ]),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    rounded: PropTypes.bool,
    icon: PropTypes.node,
    className: PropTypes.string,
};

export default Badge;

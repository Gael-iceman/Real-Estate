import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Card.css';

/**
 * Card Component
 * Flexible card container for content
 */
const Card = ({
    children,
    variant = 'elevated',
    padding = 'md',
    hoverable = false,
    clickable = false,
    onClick,
    className,
    image,
    imageAlt = '',
    header,
    footer,
    ...props
}) => {
    const cardClasses = classNames(
        'card-modern',
        `card-${variant}`,
        `card-padding-${padding}`,
        {
            'card-hoverable': hoverable,
            'card-clickable': clickable,
        },
        className
    );

    const handleClick = (e) => {
        if (clickable && onClick) {
            onClick(e);
        }
    };

    return (
        <div
            className={cardClasses}
            onClick={handleClick}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            {...props}
        >
            {image && (
                <div className="card-image">
                    <img src={image} alt={imageAlt} />
                </div>
            )}
            {header && <div className="card-header">{header}</div>}
            <div className="card-body">{children}</div>
            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['elevated', 'outlined', 'flat']),
    padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
    hoverable: PropTypes.bool,
    clickable: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string,
    image: PropTypes.string,
    imageAlt: PropTypes.string,
    header: PropTypes.node,
    footer: PropTypes.node,
};

export default Card;

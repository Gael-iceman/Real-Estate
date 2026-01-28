import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import './Modal.css';

// Set app element for accessibility
if (typeof document !== 'undefined') {
    ReactModal.setAppElement('#root');
}

/**
 * Modal Component
 * Overlay dialog for content
 */
const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnOverlayClick = true,
    showCloseButton = true,
}) => {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={onClose}
            shouldCloseOnOverlayClick={closeOnOverlayClick}
            className={`modal-content modal-${size}`}
            overlayClassName="modal-overlay"
            closeTimeoutMS={200}
        >
            <div className="modal-header">
                {title && <h2 className="modal-title">{title}</h2>}
                {showCloseButton && (
                    <button
                        className="modal-close-button"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>

            <div className="modal-body">
                {children}
            </div>

            {footer && (
                <div className="modal-footer">
                    {footer}
                </div>
            )}
        </ReactModal>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    footer: PropTypes.node,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    closeOnOverlayClick: PropTypes.bool,
    showCloseButton: PropTypes.bool,
};

export default Modal;

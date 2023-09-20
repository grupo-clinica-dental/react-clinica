import React from "react";
import PropTypes from "prop-types";

const Modal = ({ children, isOpen, onClose, showCloseButton = true }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {showCloseButton && (
          <button
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
            }}
            onClick={onClose}
          >
            Close
          </button>
        )}

        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default Modal;

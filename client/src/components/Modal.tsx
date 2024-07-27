import React from 'react';
import styles from './css/Modal.module.css';
interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;
	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				{children}
				<button
					className={styles.closeButton}
					onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
};
export default Modal;

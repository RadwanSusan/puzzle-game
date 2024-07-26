// src/components/Modal.tsx
import React from 'react';
import styles from './css/Modal.module.css';
interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
	if (!isOpen) return null;
	return (
		<div className={styles.modalOverlay}>
			<div className={styles.modalContent}>
				<h2>{title}</h2>
				{children}
				<button onClick={onClose}>Close</button>
			</div>
		</div>
	);
};
export default Modal;

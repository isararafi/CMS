import React, { useEffect } from 'react';
import styles from '../../styles/components/toast.module.scss';

const icons = {
  info: (
    <span className={styles.icon} aria-label="info">ℹ️</span>
  ),
  success: (
    <span className={styles.icon} aria-label="success">✔️</span>
  ),
  error: (
    <span className={styles.icon} aria-label="error">❌</span>
  ),
};

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose && onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}> 
      {icons[type]}
      <span className={styles.message}>{message}</span>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
      <div className={styles.progressBar}>
        <div className={styles.progress} />
      </div>
    </div>
  );
};

export default Toast; 
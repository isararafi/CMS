import React, { useEffect } from 'react';
import styles from '../../styles/components/toast.module.scss';

const icons = {
  info: (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
    </svg>
  ),
  success: (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  error: (
    <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
    </svg>
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
    <div 
      className={`${styles.toastContainer} ${styles[type]}`}
      role="alert"
      aria-live="polite"
    > 
      <div className={styles.toastContent}>
        {icons[type]}
        <p className={styles.message}>{message}</p>
        <button 
          className={styles.closeBtn} 
          onClick={onClose} 
          aria-label="Close notification"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      <div className={styles.progressBar}>
        <div 
          className={styles.progress} 
          style={{ animationDuration: `${duration}ms` }} 
        />
      </div>
    </div>
  );
};

export default Toast; 
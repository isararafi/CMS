import React from 'react';
import styles from '../../styles/custom/unauthorizedPage.module.scss';

const UnauthorizedPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
        </div>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.message}>
          You don't have permission to access this page. Please check your credentials or contact the administrator for assistance.
        </p>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={() => window.location.href = '/login'}>
            Login
          </button>
          <button className={styles.btnSecondary} onClick={() => window.location.href = '/'}>
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
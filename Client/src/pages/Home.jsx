import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen } from 'lucide-react';//icon packages
import styles from '../styles/components/home.module.scss';

const Home = () => {
  return (
    <div className={styles.homepageContainer}>
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.contentWrapper}>
        <div className={styles.headerSection}>
          <h1 className={styles.mainTitle}>Campus Connect</h1>
          <p className={styles.subTitle}>Empowering Education, Connecting Minds</p>
        </div>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <GraduationCap className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Student Portal</h3>
            <p className={styles.featureDescription}>
              Access your academic journey, track progress, and manage your learning.
            </p>
            <Link to="/login?role=student">
              <button className={styles.featureButton}>Login </button>
            </Link>
          </div>

          <div className={styles.featureCard}>
            <Users className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Admin Dashboard</h3>
            <p className={styles.featureDescription}>
              Manage institutional operations, track performance, and generate reports.
            </p>
            <Link to="/login?role=admin">
              <button className={styles.featureButton}>Control Hub</button>
            </Link>
          </div>

          <div className={styles.featureCard}>
            <BookOpen className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Teacher Hub</h3>
            <p className={styles.featureDescription}>
              Collaborate, manage classes, and engage with students effectively.
            </p>
            <Link to="/login?role=teacher">
              <button className={styles.featureButton}>Login </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
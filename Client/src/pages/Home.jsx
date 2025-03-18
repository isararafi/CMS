import React from 'react';
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
            <button className={styles.featureButton}>Login Now</button>
          </div>

          {/* <div className={styles.featureCard}>
            <Users className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Admin Dashboard</h3>
            <p className={styles.featureDescription}>
              Manage institutional operations, track performance, and generate reports.
            </p>
            <button className={styles.featureButton}>Access System</button>
          </div> */}

          <div className={styles.featureCard}>
            <BookOpen className={styles.featureIcon} />
            <h3 className={styles.featureTitle}>Teacher Hub</h3>
            <p className={styles.featureDescription}>
              Collaborate, manage classes, and engage with students effectively and efficiently.
            </p>
            <button className={styles.featureButton}>Login Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
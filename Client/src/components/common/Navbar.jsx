import React, { useState } from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';
import styles from '../../styles/components/navbar.module.scss';

const Navbar = ({ toggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={styles.navbar}>
      <div className={styles.wrapper}>
        <div className={styles.mobileMenuToggle}>
          <button onClick={toggleSidebar} className={styles.menuButton}>
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* <div className={styles.searchContainer}>
          <Search size={18} strokeWidth={1.5} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div> */}

        <div className={styles.navActions}>
          {/* <div className={styles.notificationIcon}>
            <Bell size={20} strokeWidth={1.5} />
            <span className={styles.badge}>3</span>
          </div> */}

          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              <User size={20} strokeWidth={1.5} />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>Admin User</p>
              <p className={styles.userRole}>System Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

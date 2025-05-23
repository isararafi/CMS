import React, { useState } from 'react';
import { Download } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import CustomTable from '../components/common/CustomTable';
import styles from '../styles/pages/studentFees.module.scss';

const StudentFees = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock student info
  const studentData = {
    name: 'John Smith',
    rollNo: 'Fall 23-BSSE-123',
  };

  // Mock fee records
  const feeRecords = [
    { Semester: 'Fall 2023', 'Semester Dues': 50000, 'Dues Paid': 50000, 'Paid Date': '2023-09-10', 'Outstanding Balance': 0 },
    { Semester: 'Spring 2023', 'Semester Dues': 48000, 'Dues Paid': 48000, 'Paid Date': '2023-02-15', 'Outstanding Balance': 0 },
    { Semester: 'Fall 2022', 'Semester Dues': 47000, 'Dues Paid': 47000, 'Paid Date': '2022-09-12', 'Outstanding Balance': 0 },
    { Semester: 'Spring 2022', 'Semester Dues': 46000, 'Dues Paid': 40000, 'Paid Date': '2022-02-20', 'Outstanding Balance': 6000 },
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            <div className={styles.dashboardHeader}>
              <div className={styles.welcomeSection}>
                <h1>Fee Record</h1>
              </div>
              <div className={styles.studentInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Name:</span>
                  <span className={styles.value}>{studentData.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Roll No:</span>
                  <span className={styles.value}>{studentData.rollNo}</span>
                </div>
              </div>
            </div>
            <button className={styles.downloadButton} style={{ marginBottom: 24 }}>
              <Download size={16} strokeWidth={1.5} style={{ marginRight: 8 }} />
              Download Fee Challan
                  </button>
            <CustomTable
              headers={['Semester', 'Semester Dues', 'Dues Paid', 'Paid Date', 'Outstanding Balance']}
              data={feeRecords}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFees; 
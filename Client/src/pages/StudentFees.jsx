import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import CustomTable from '../components/common/CustomTable';
import styles from '../styles/pages/studentFees.module.scss';
import { useToast } from '../context/ToastContext';

const StudentFees = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { showToast } = useToast();

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

  useEffect(() => {
    // Simulating API call
    showToast('Fee records loaded successfully', 'success');
  }, [showToast]);

  const handleDownloadChallan = () => {
    try {
      // Add your download logic here
      showToast('Fee challan downloaded successfully', 'success');
    } catch (error) {
      showToast('Failed to download fee challan', 'error');
    }
  };

  const handlePayFees = () => {
    try {
      // Add your payment logic here
      showToast('Payment processed successfully', 'success');
    } catch (error) {
      showToast('Failed to process payment', 'error');
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* Decorative elements */}
      <div className={styles.decorativeWave}></div>
      <div className={styles.decorativeTriangle}></div>
      <div className={styles.decorativeCircle}></div>
      <div className={styles.decorativeDots}></div>
      <div className={styles.decorativeDiamond}></div>
      
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.expanded : ''}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className={styles.contentWrapper}>
          <div className={styles.pageContent}>
            <div className={styles.dashboardHeader}>
              <div className={styles.welcomeSection}>
                <h1>Fee Management</h1>
                <p className={styles.subtitle}>View and manage your fee payments</p>
              </div>
              <div className={styles.studentInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Roll No:</span>
                  <span className={styles.value}>{studentData.rollNo}</span>
                </div>
              </div>
            </div>

            <div className={styles.feeActions}>
              <button 
                className={styles.downloadButton}
                onClick={handleDownloadChallan}
              >
                <Download size={16} />
                Download Fee Challan
              </button>
              <button 
                className={styles.payButton}
                onClick={handlePayFees}
              >
                Pay Fees Online
              </button>
            </div>

            <div className={styles.feeHistory}>
              <h2>Fee History</h2>
              <CustomTable 
                headers={['Semester', 'Semester Dues', 'Dues Paid', 'Paid Date', 'Outstanding Balance']}
                data={feeRecords}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFees; 
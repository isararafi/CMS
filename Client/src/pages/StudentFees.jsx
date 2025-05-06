import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import styles from '../styles/pages/fees.module.scss';

const StudentFees = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState('Fall 2023');
  const [semesterDropdownOpen, setSemesterDropdownOpen] = useState(false);

  // Mock data - would be fetched from API
  const studentData = {
    name: "John Smith",
    rollNo: "Fall 23-BSSE-123",
    department: "Software Engineering",
    semesters: [
      'Fall 2021', 'Spring 2022', 'Fall 2022', 'Spring 2023', 'Fall 2023'
    ],
    fees: {
      'Fall 2023': {
        tuitionFee: 50000,
        registrationFee: 5000,
        examinationFee: 3000,
        libraryFee: 2000,
        transportFee: 8000,
        hostleFee: 15000,
        miscFee: 2000,
        totalFee: 85000,
        paidAmount: 60000,
        dueAmount: 25000,
        dueDate: '2023-11-30',
        installments: [
          { id: 1, amount: 30000, dueDate: '2023-08-15', status: 'paid', paymentDate: '2023-08-12', paymentMethod: 'Online Transfer', transactionId: 'TRX123456' },
          { id: 2, amount: 30000, dueDate: '2023-10-15', status: 'paid', paymentDate: '2023-10-10', paymentMethod: 'Online Transfer', transactionId: 'TRX789012' },
          { id: 3, amount: 25000, dueDate: '2023-11-30', status: 'pending', paymentDate: null, paymentMethod: null, transactionId: null }
        ],
        status: 'partially_paid'
      },
      'Spring 2023': {
        tuitionFee: 45000,
        registrationFee: 5000,
        examinationFee: 3000,
        libraryFee: 2000,
        transportFee: 8000,
        hostleFee: 15000,
        miscFee: 2000,
        totalFee: 80000,
        paidAmount: 80000,
        dueAmount: 0,
        dueDate: '2023-05-30',
        installments: [
          { id: 1, amount: 40000, dueDate: '2023-02-15', status: 'paid', paymentDate: '2023-02-10', paymentMethod: 'Online Transfer', transactionId: 'TRX345678' },
          { id: 2, amount: 40000, dueDate: '2023-04-15', status: 'paid', paymentDate: '2023-04-12', paymentMethod: 'Online Transfer', transactionId: 'TRX901234' }
        ],
        status: 'paid'
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
    setSemesterDropdownOpen(false);
  };

  const toggleSemesterDropdown = () => {
    setSemesterDropdownOpen(!semesterDropdownOpen);
  };

  const currentFees = studentData.fees[selectedSemester];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return styles.statusPaid;
      case 'partially_paid':
        return styles.statusPartiallyPaid;
      case 'pending':
        return styles.statusPending;
      case 'overdue':
        return styles.statusOverdue;
      default:
        return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} strokeWidth={1.5} />;
      case 'partially_paid':
        return <Clock size={16} strokeWidth={1.5} />;
      case 'pending':
        return <Clock size={16} strokeWidth={1.5} />;
      case 'overdue':
        return <AlertCircle size={16} strokeWidth={1.5} />;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                <h1>Fee Management</h1>
                <p className={styles.subtitle}>View and manage your fee payments</p>
              </div>
              <div className={styles.studentInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Roll No:</span>
                  <span className={styles.value}>{studentData.rollNo}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Department:</span>
                  <span className={styles.value}>{studentData.department}</span>
                </div>
              </div>
            </div>

            <div className={styles.feeControls}>
              <div className={styles.semesterSelect}>
                <label>Select Semester:</label>
                <div className={styles.dropdownContainer}>
                  <button 
                    className={styles.dropdownToggle}
                    onClick={toggleSemesterDropdown}
                  >
                    {selectedSemester}
                    <ChevronDown size={16} strokeWidth={1.5} />
                  </button>
                  {semesterDropdownOpen && (
                    <div className={styles.dropdownMenu}>
                      {studentData.semesters.map(semester => (
                        <div 
                          key={semester} 
                          className={`${styles.dropdownItem} ${selectedSemester === semester ? styles.active : ''}`}
                          onClick={() => handleSemesterSelect(semester)}
                        >
                          {semester}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button className={styles.downloadButton}>
                <Download size={16} strokeWidth={1.5} />
                Download Receipt
              </button>
            </div>

            <div className={styles.feeContent}>
              <div className={styles.feeSummary}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon}>
                    <DollarSign size={24} strokeWidth={1.5} />
                  </div>
                  <div className={styles.summaryDetails}>
                    <h3>Total Fee</h3>
                    <div className={styles.amount}>₹{currentFees?.totalFee.toLocaleString()}</div>
                  </div>
                </div>

                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon}>
                    <CreditCard size={24} strokeWidth={1.5} />
                  </div>
                  <div className={styles.summaryDetails}>
                    <h3>Paid Amount</h3>
                    <div className={styles.amount}>₹{currentFees?.paidAmount.toLocaleString()}</div>
                  </div>
                </div>

                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon}>
                    <FileText size={24} strokeWidth={1.5} />
                  </div>
                  <div className={styles.summaryDetails}>
                    <h3>Due Amount</h3>
                    <div className={`${styles.amount} ${currentFees?.dueAmount > 0 ? styles.dueAmount : ''}`}>
                      ₹{currentFees?.dueAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className={styles.summaryCard}>
                  <div className={styles.summaryIcon}>
                    <Calendar size={24} strokeWidth={1.5} />
                  </div>
                  <div className={styles.summaryDetails}>
                    <h3>Due Date</h3>
                    <div className={styles.date}>
                      {currentFees?.dueAmount > 0 ? formatDate(currentFees.dueDate) : 'No Due'}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.feeDetails}>
                <div className={styles.feeBreakdown}>
                  <h2>Fee Breakdown</h2>
                  <div className={styles.breakdownList}>
                    <div className={styles.breakdownItem}>
                      <span className={styles.feeLabel}>Tuition Fee</span>
                      <span className={styles.feeValue}>₹{currentFees?.tuitionFee.toLocaleString()}</span>
                    </div>
                    <div className={styles.breakdownItem}>
                      <span className={styles.feeLabel}>Registration Fee</span>
                      <span className={styles.feeValue}>₹{currentFees?.registrationFee.toLocaleString()}</span>
                    </div>
                    <div className={styles.breakdownItem}>
                      <span className={styles.feeLabel}>Examination Fee</span>
                      <span className={styles.feeValue}>₹{currentFees?.examinationFee.toLocaleString()}</span>
                    </div>
                    <div className={styles.breakdownItem}>
                      <span className={styles.feeLabel}>Library Fee</span>
                      <span className={styles.feeValue}>₹{currentFees?.libraryFee.toLocaleString()}</span>
                    </div>
                    <div className={styles.breakdownItem}>
                      <span className={styles.feeLabel}>Transport Fee</span>
                      <span className={styles.feeValue}>₹{currentFees?.transportFee.toLocaleString()}</span>
                    </div>
                    <div className={styles.breakdownItem}>
                      <span className={styles.feeLabel}>Hostel Fee</span>
                      <span className={styles.feeValue}>₹{currentFees?.hostleFee.toLocaleString()}</span>
                    </div>
                    <div className={styles.breakdownItem}>
                      <span className={styles.feeLabel}>Miscellaneous Fee</span>
                      <span className={styles.feeValue}>₹{currentFees?.miscFee.toLocaleString()}</span>
                    </div>
                    <div className={`${styles.breakdownItem} ${styles.totalItem}`}>
                      <span className={styles.feeLabel}>Total Fee</span>
                      <span className={styles.feeValue}>₹{currentFees?.totalFee.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.installments}>
                  <h2>Payment Schedule</h2>
                  <div className={styles.installmentsList}>
                    {currentFees?.installments.map(installment => (
                      <div 
                        key={installment.id} 
                        className={`${styles.installmentItem} ${getStatusColor(installment.status)}`}
                      >
                        <div className={styles.installmentHeader}>
                          <div className={styles.installmentAmount}>₹{installment.amount.toLocaleString()}</div>
                          <div className={`${styles.installmentStatus}`}>
                            {getStatusIcon(installment.status)}
                            <span>{installment.status.charAt(0).toUpperCase() + installment.status.slice(1)}</span>
                          </div>
                        </div>
                        <div className={styles.installmentDetails}>
                          <div className={styles.dueDateInfo}>
                            <span className={styles.label}>Due Date:</span>
                            <span className={styles.value}>{formatDate(installment.dueDate)}</span>
                          </div>
                          {installment.status === 'paid' && (
                            <>
                              <div className={styles.paymentInfo}>
                                <span className={styles.label}>Payment Date:</span>
                                <span className={styles.value}>{formatDate(installment.paymentDate)}</span>
                              </div>
                              <div className={styles.paymentMethod}>
                                <span className={styles.label}>Payment Method:</span>
                                <span className={styles.value}>{installment.paymentMethod}</span>
                              </div>
                              <div className={styles.transactionId}>
                                <span className={styles.label}>Transaction ID:</span>
                                <span className={styles.value}>{installment.transactionId}</span>
                              </div>
                            </>
                          )}
                        </div>
                        {installment.status === 'pending' && (
                          <div className={styles.installmentActions}>
                            <button className={styles.payNowButton}>
                              Pay Now
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.paymentMethods}>
                <h2>Payment Methods</h2>
                <div className={styles.methodsList}>
                  <div className={styles.methodItem}>
                    <div className={styles.methodIcon}>
                      <img src="/icons/online-banking.png" alt="Online Banking" />
                    </div>
                    <div className={styles.methodDetails}>
                      <h3>Online Banking</h3>
                      <p>Make payments directly from your bank account.</p>
                      <div className={styles.bankDetails}>
                        <div className={styles.bankInfo}>
                          <span className={styles.label}>Bank Name:</span>
                          <span className={styles.value}>State Bank of India</span>
                        </div>
                        <div className={styles.bankInfo}>
                          <span className={styles.label}>Account Number:</span>
                          <span className={styles.value}>123456789012</span>
                        </div>
                        <div className={styles.bankInfo}>
                          <span className={styles.label}>IFSC Code:</span>
                          <span className={styles.value}>SBIN0001234</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.methodItem}>
                    <div className={styles.methodIcon}>
                      <img src="/icons/credit-card.png" alt="Credit/Debit Card" />
                    </div>
                    <div className={styles.methodDetails}>
                      <h3>Credit/Debit Card</h3>
                      <p>Pay securely using your credit or debit card.</p>
                      <button className={styles.payButton}>Pay with Card</button>
                    </div>
                  </div>

                  <div className={styles.methodItem}>
                    <div className={styles.methodIcon}>
                      <img src="/icons/upi.png" alt="UPI" />
                    </div>
                    <div className={styles.methodDetails}>
                      <h3>UPI</h3>
                      <p>Pay instantly using any UPI app.</p>
                      <div className={styles.upiInfo}>
                        <span className={styles.label}>UPI ID:</span>
                        <span className={styles.value}>university@sbi</span>
                      </div>
                      <button className={styles.payButton}>Pay with UPI</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFees; 
import React, { useState, useEffect } from 'react';
import styles from '../styles/pages/login.module.scss';

const Login = () => {
  // State to store the user role from API
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    semester: '',
    department: '',
    regNumber: '',
    password: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Semester options for dropdown
  const semesterOptions = ['Fall 22', 'Spring 22', 'Fall 23', 'Spring 23', 'Fall 24', 'Spring 24'];
  
  // Department options for dropdown
  const departmentOptions = ['BSSE', 'BSCS', 'BSIT', 'BSAI'];

  // Color scheme
  const colorScheme = {
    primary: '#2E7D32', // Green 800
    secondary: '#4CAF50', // Green 500
    light: '#C8E6C9', // Green 100
    dark: '#1B5E20', // Green 900
    accent: '#81C784' // Green 300
  };

  // Simulating API call to get user role
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchUserRole = async () => {
      try {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // For demonstration, we'll use 'student' as the default role
        // In a real app, this would come from the API response
        const roleFromApi = 'teacher';
        setUserRole(roleFromApi);
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  // Role-specific configurations
  const roleConfigs = {
    student: {
      title: 'Student Portal',
      fields: [
        { 
          type: 'rollNo', 
          label: 'Roll No', 
          components: [
            { name: 'semester', type: 'select', options: semesterOptions, required: true },
            { name: 'department', type: 'select', options: departmentOptions, required: true },
            { name: 'regNumber', type: 'text', required: true }
          ]
        },
        { name: 'password', label: 'Password', type: 'password', required: true }
      ],
      welcomeMessage: 'Welcome to the Student Portal. Please log in to access your courses and assignments.'
    },
    teacher: {
      title: 'Teacher Portal',
      fields: [
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true }
      ],
      welcomeMessage: 'Welcome to the Teacher Portal. Log in to manage your classes and student records.'
    },
    admin: {
      title: 'Admin Portal',
      fields: [
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true }
      ],
      welcomeMessage: 'Welcome to the Administrator Portal. Log in to access system configuration and reports.'
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to verify credentials
    console.log('Submitting:', { 
      role: userRole, 
      rollNo: `${formData.semester}-${formData.department}-${formData.regNumber}`,
      password: formData.password 
    });
    setIsSubmitted(true);
  };

  // Get current role configuration
  const currentConfig = userRole ? roleConfigs[userRole] : null;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading portal...</p>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer} style={{ '--primary-color': colorScheme.primary, '--secondary-color': colorScheme.secondary, '--light-color': colorScheme.light, '--dark-color': colorScheme.dark, '--accent-color': colorScheme.accent }}>
      <div className={styles.loginCard}>
        {!isSubmitted ? (
          <div className={styles.loginFormContainer}>
            <div className={styles.logoContainer}>
              <div className={styles.logo}></div>
              <h1 className={styles.portalTitle}>{currentConfig?.title || 'Portal Login'}</h1>
            </div>
            
            <p className={styles.welcomeText}>{currentConfig?.welcomeMessage || 'Please log in to continue'}</p>
            
            <form onSubmit={handleSubmit} className={styles.loginForm}>
              {currentConfig?.fields.map((fieldConfig, index) => {
                if (fieldConfig.type === 'rollNo') {
                  return (
                    <div key={`field-rollNo`} className={styles.formGroup}>
                      <label>{fieldConfig.label}:</label>
                      <div className={styles.rollNoContainer}>
                        <select
                          name="semester"
                          value={formData.semester}
                          onChange={handleInputChange}
                          required
                          className={styles.formSelect}
                        >
                          <option value="">Semester</option>
                          {fieldConfig.components[0].options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <span className={styles.separator}>-</span>
                        <select
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          required
                          className={styles.formSelect}
                        >
                          <option value="">Dept</option>
                          {fieldConfig.components[1].options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                        <span className={styles.separator}>-</span>
                        <input
                          type="text"
                          name="regNumber"
                          value={formData.regNumber}
                          onChange={handleInputChange}
                          required
                          placeholder="Reg No"
                          className={styles.formInput}
                        />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={`field-${fieldConfig.name}`} className={styles.formGroup}>
                      <label htmlFor={fieldConfig.name}>{fieldConfig.label}:</label>
                      <input
                        type={fieldConfig.type}
                        id={fieldConfig.name}
                        name={fieldConfig.name}
                        value={formData[fieldConfig.name]}
                        onChange={handleInputChange}
                        required={fieldConfig.required}
                        placeholder={fieldConfig.label}
                        className={styles.formInput}
                      />
                    </div>
                  );
                }
              })}
              
              <div className={styles.formFooter}>
                <button type="submit" className={styles.submitButton}>
                  Sign In
                </button>
                <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
              </div>
            </form>
          </div>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h2>Login Successful!</h2>
            <div className={styles.userInfo}>
              <p>Role: <strong>{userRole}</strong></p>
              <p>Roll No: <strong>{formData.semester}-{formData.department}-{formData.regNumber}</strong></p>
            </div>
            <button 
              onClick={() => setIsSubmitted(false)}
              className={styles.backButton}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
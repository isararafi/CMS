import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStudent, loginTeacher, loginAdmin } from '../features/auth/authSlice';
import styles from '../styles/pages/login.module.scss';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, token } = useSelector((state) => state.auth);
  
  // State to store user role (e.g., student, teacher, admin)
  const [userRole, setUserRole] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form data to store user inputs
  const [formData, setFormData] = useState({
    semester: '',
    department: '',
    regNumber: '',
    email: '',
    password: ''
  });

  // Dropdown options for semester
  const semesterOptions = ['2022', 'Spring 22', 'Fall 23', 'Spring 23', 'Fall 24', 'Spring 24'];

  // Dropdown options for department
  const departmentOptions = ['Computer Science', 'BSCS', 'BSIT', 'BSAI'];

  // Color theme for styling
  const colorScheme = {
    primary: '#2E7D32',
    secondary: '#4CAF50',
    light: '#C8E6C9',
    dark: '#1B5E20',
    accent: '#81C784'
  };

  // Redirect if already logged in
  // useEffect(() => {
  //   if (token && userRole) {
  //     if (userRole === 'student') {
  //       navigate('/student/dashboard');
  //     } else if (userRole === 'teacher') {
  //       navigate('/teacher');
  //     } else if (userRole === 'admin') {
  //       navigate('/admin');
  //     }
  //   }
  // }, [token, userRole, navigate]);

  // Get role from URL and simulate fetching from API
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleFromUrl = params.get('role');
    
    const fetchUserRole = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const roleFromApi = roleFromUrl || 'student';
        setUserRole(roleFromApi);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  // Configurations for different user roles
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

  // Handle changes in form input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      let credentials;
      
      switch (userRole) {
        case 'student':
          credentials = {
            batch: formData.semester,
            department: formData.department,
            rollNo: formData.regNumber,
            password: formData.password
          };
          response = await dispatch(loginStudent(credentials)).unwrap();
          navigate('/student/dashboard');
          break;

          
        case 'teacher':
          credentials = {
            email: formData.email,
            password: formData.password
          };
          response = await dispatch(loginTeacher(credentials)).unwrap();
          navigate('/teacher');
          break;
          
        case 'admin':
          credentials = {
            email: formData.email,
            password: formData.password
          };
          response = await dispatch(loginAdmin(credentials)).unwrap();
          navigate('/admin');
          break;
          
        default:
          throw new Error('Invalid user role');
      }
      
      if (response.token) {
        setIsSuccess(true);
        // Navigation will be handled by the useEffect watching the token
      }
    } catch (err) {
      console.error('Login failed:', err);
      // Error state is handled by Redux
    }
  };

  // Get configuration based on user role
  const currentConfig = userRole ? roleConfigs[userRole] : null;

  // Show loading spinner while role is being determined
  if (!userRole) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading portal...</p>
      </div>
    );
  }

  // Main JSX structure of the login page
  return (
    <div className={styles.loginContainer} style={{ '--primary-color': colorScheme.primary, '--secondary-color': colorScheme.secondary, '--light-color': colorScheme.light, '--dark-color': colorScheme.dark, '--accent-color': colorScheme.accent }}>
      <div className={styles.loginCard}>
        {!isSuccess ? (
          <div className={styles.loginFormContainer}>
            <div className={styles.logoContainer}>
              <div className={styles.logo}></div>
              <h1 className={styles.portalTitle}>{currentConfig?.title || 'Portal Login'}</h1>
            </div>
            
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <p className={styles.welcomeText}>{currentConfig?.welcomeMessage || 'Please log in to continue'}</p>
            
            <form onSubmit={handleSubmit} className={styles.loginForm}>
              {/* Render fields based on current role */}
              {currentConfig?.fields.map((fieldConfig) => {
                if (fieldConfig.type === 'rollNo') {
                  // For student roll number fields
                  return (
                    <div key={`field-rollNo`} className={styles.formGroup}>
                      <label>{fieldConfig.label}:</label>
                      <div className={styles.rollNoContainer}>
                        {/* Semester dropdown */}
                        <select
                          name="semester"
                          value={formData.semester}
                          onChange={handleInputChange}
                          required
                          className={styles.formSelect}
                        >
                          <option value="">Sem</option>
                          {fieldConfig.components[0].options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>

                        <span className={styles.separator}>-</span>

                        {/* Department dropdown */}
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

                        {/* Registration number input */}
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
                  // For email and password fields
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
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
                <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
              </div>
            </form>
          </div>
        ) : (
          // Show success message after login
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h2>Login Successful!</h2>
            <div className={styles.userInfo}>
              <p>Role: <strong>{userRole}</strong></p>
              {userRole === 'student' ? (
                <p>Roll No: <strong>{formData.semester}-{formData.department}-{formData.regNumber}</strong></p>
              ) : (
                <p>Email: <strong>{formData.email}</strong></p>
              )}
            </div>

            {/* Button to return to login screen */}
            <button 
              onClick={() => setIsSuccess(false)}
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

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginStudent, loginTeacher, loginAdmin } from '../features/auth/authSlice';
import styles from '../styles/pages/login.module.scss';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Add this import and usage
  const { isLoading, error, token, userType } = useSelector((state) => state.auth);
  const { showToast } = useToast();
  
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
  const semesterOptions = ['2020', '2021', '2022', '2023', '2024', '2025'];

  // Dropdown options for department
  const departmentOptions = ['Computer Science', 'Software Engineering', 'Information Technology', 'Artificial Intelligence'];

  // Color theme for styling
  const colorScheme = {
    primary: '#2E7D32',
    secondary: '#4CAF50',
    light: '#C8E6C9',
    dark: '#1B5E20',
    accent: '#81C784'
  };

  // Check for existing token on component mount
  useEffect(() => {
    const existingToken = localStorage.getItem('token');
    if (existingToken && !token) {
      // You might want to validate the token here or set it in Redux
      console.log('Existing token found:', existingToken);
    }
  }, [token]);

  // Check for existing token and redirect if already logged in
  useEffect(() => {
    // Only redirect if there's both a token and userType
    if (token && userType) {
      const storedToken = localStorage.getItem('token');
      const storedUserRole = localStorage.getItem('userRole');
      
      // Only redirect if both token and role match what's in localStorage
      if (storedToken === token && storedUserRole === userType) {
        switch (userType) {
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'teacher':
            navigate('/teacher');
            break;
          case 'admin':
            navigate('/admin');
            break;
          default:
            break;
        }
      }
    }
  }, [token, userType, navigate]);

  // Get role from URL and simulate fetching from API
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleFromUrl = params.get('role');
    
    const fetchUserRole = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const roleFromApi = roleFromUrl || 'student';
        setUserRole(roleFromApi);
        console.log('User role set to:', roleFromApi);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, [location.search]);

  // Configurations for different user roles
  const roleConfigs = {
    student: {
      title: 'Student Portal',
      fields: [
        { 
          type: 'rollNo', 
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
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      if (userRole === 'student') {
        // const [semester, department, regNumber] = formData.regNumber.split('-');
        response = await dispatch(loginStudent({ 
          batch: formData.semester, 
          department: formData.department, 
          rollNo: formData.regNumber, 
          password: formData.password 
        })).unwrap();
      } else if (userRole === 'teacher') {
        response = await dispatch(loginTeacher({ 
          email: formData.email, 
          password: formData.password 
        })).unwrap();
      } else if (userRole === 'admin') {
        response = await dispatch(loginAdmin({ 
          email: formData.email, 
          password: formData.password 
        })).unwrap();
      }

      if (response) {
        showToast('Login successful', 'success');
        setIsSuccess(true);
        const redirectPath = userRole === 'student' 
          ? '/student/dashboard'
          : userRole === 'teacher'
          ? '/teacher'
          : '/admin';
        navigate(redirectPath);
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please check your credentials.', 'error');
      setIsSuccess(false);
    }
  };

  // Get configuration based on user role
  const currentConfig = userRole ? roleConfigs[userRole] : null;

  // Show loading spinner while role is being determined
  if (!userRole) {
    console.log('Loading user role...');
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading portal...</p>
      </div>
    );
  }

  // Main JSX structure of the login page
  console.log('Rendering login form for role:', userRole);
  return (
    <div className={styles.loginContainer} style={{ 
      '--primary-color': colorScheme.primary, 
      '--secondary-color': colorScheme.secondary, 
      '--light-color': colorScheme.light, 
      '--dark-color': colorScheme.dark, 
      '--accent-color': colorScheme.accent 
    }}>
      <div className={styles.loginCard}>
        {!isSuccess ? (
          <div className={styles.loginFormContainer}>
            <div className={styles.logoContainer}>
              <div className={styles.logo}></div>
              <h1 className={styles.portalTitle}>{currentConfig?.title || 'Portal Login'}</h1>
            </div>
            
            {error && (
              <div className={styles.errorMessage}>
                {typeof error === 'string' ? error : 'Login failed. Please try again.'}
              </div>
            )}
            
            <p className={styles.welcomeText}>{currentConfig?.welcomeMessage || 'Please log in to continue'}</p>
            
            <form onSubmit={handleSubmit} className={styles.loginForm}>
              {/* Render fields based on current role */}
              {currentConfig?.fields.map((fieldConfig, index) => {
                if (fieldConfig.type === 'rollNo') {
                  // For student roll number fields
                  return (
                    <div key={`field-rollNo-${index}`} className={styles.formGroup}>
                      <label>Roll Number</label>
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
                    <div key={`field-${fieldConfig.name}-${index}`} className={styles.formGroup}>
                      <label htmlFor={fieldConfig.name}>{fieldConfig.label}:</label>
                      <input
                        type={fieldConfig.type}
                        id={fieldConfig.name}
                        name={fieldConfig.name}
                        value={formData[fieldConfig.name] || ''}
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
            <p>Redirecting to dashboard...</p>

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
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  loginStudent,
  loginTeacher,
  loginAdmin,
} from "../features/auth/authThunk";
import styles from "../styles/pages/login.module.scss";
import { useToast } from "../context/ToastContext";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Add this import and usage
  const { user, token, userType, loading} = useSelector(
    (state) => state.auth,
  );
  const { showToast } = useToast();

  const [errors, setErrors] = useState({});
  // State to store user role (e.g., student, teacher, admin)
  const [userRole, setUserRole] = useState(null);

  // Form data to store user inputs
  const [formData, setFormData] = useState({
    batch: "",
    department: "",
    rollNo: "",
    email: "",
    password: "",
  });

  // Dropdown options for department
  const departmentOptions = ["BSSE", "BSCS", "BBA", "BCE"];

  // Color theme for styling
  const colorScheme = {
    primary: "#2E7D32",
    secondary: "#4CAF50",
    light: "#C8E6C9",
    dark: "#1B5E20",
    accent: "#81C784",
  };

  useEffect(() => {
    if (token && userType) {
      const dashboardRoutes = {
        student: "/student/dashboard",
        teacher: "/teacher",
        admin: "/admin",
      };

      navigate(dashboardRoutes[userType]);
    }
  }, [token, userType, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleFromUrl = params.get("role") || "student";
    setUserRole(roleFromUrl);
    // Reset form when role changes
    setFormData({
      batch: "",
      department: "",
      rollNo: "",
      email: "",
      password: "",
    });
  }, [location.search]);

  // Configurations for different user roles
  const roleConfigs = {
    student: {
      title: "Student Portal",
      fields: [
        {
          name: "batch",
          label: "Batch",
          type: "text",
          required: true,
        },
        {
          name: "department",
          label: "Department",
          type: "select",
          options: departmentOptions,
          required: true,
        },
        {
          name: "rollNo",
          label: "Roll Number",
          type: "text",
          required: true,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          required: true,
        },
      ],
      welcomeMessage:
        "Welcome to the Student Portal. Please log in to access your courses and assignments.",
    },
    teacher: {
      title: "Teacher Portal",
      fields: [
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          required: true,
        },
      ],
      welcomeMessage:
        "Welcome to the Teacher Portal. Log in to manage your classes and student records.",
    },
    admin: {
      title: "Admin Portal",
      fields: [
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          required: true,
        },
      ],
      welcomeMessage:
        "Welcome to the Administrator Portal. Log in to access system configuration and reports.",
    },
  };

  const validateForm = () => {
    const newErrors = {};

    currentConfig?.fields.forEach((field) => {
      const value = formData[field.name];

      // Required validation
      if (field.required && !value?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
        return;
      }

      // Email validation
      if (field.type === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = "Invalid email format";
        }
      }

      // Password validation
      if (field.name === "password" && value) {
        if (value.length < 6) {
          newErrors[field.name] = "Password must be at least 6 characters";
        }
      }

      // Roll number validation
      if (field.name === "rollNo" && value) {
        if (value.length < 3) {
          newErrors[field.name] = "Roll number is too short";
        }
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle changes in form input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) return;

    try {
      let response;

      if (userRole === "student") {
        response = await dispatch(
          loginStudent({
            batch: formData.batch,
            department: formData.department,
            rollNo: formData.rollNo,
            password: formData.password,
          }),
        ).unwrap();
      } else if (userRole === "teacher") {
        response = await dispatch(
          loginTeacher({
            email: formData.email,
            password: formData.password,
          }),
        ).unwrap();
      } else if (userRole === "admin") {
        response = await dispatch(
          loginAdmin({
            email: formData.email,
            password: formData.password,
          }),
        ).unwrap();
      }

      if (response) {
        showToast("Login successful", "success");
      }
    } catch (err) {
      showToast(
        err?.message,
        "error",
      );
    }
  };

  // Get configuration based on user role
  const currentConfig = userRole ? roleConfigs[userRole] : null;

  // Show loading spinner while role is being determined
  if (!userRole) {
    console.log("Loading user role...");
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading portal...</p>
      </div>
    );
  }
  return (
    <div
      className={styles.loginContainer}
      style={{
        "--primary-color": colorScheme.primary,
        "--secondary-color": colorScheme.secondary,
        "--light-color": colorScheme.light,
        "--dark-color": colorScheme.dark,
        "--accent-color": colorScheme.accent,
      }}
    >
      <div className={styles.loginCard}>
        <div className={styles.loginFormContainer}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}></div>
            <h1 className={styles.portalTitle}>
              {currentConfig?.title || "Portal Login"}
            </h1>
          </div>

          <p className={styles.welcomeText}>{currentConfig?.welcomeMessage}</p>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            {/* Render fields based on current role */}
            {currentConfig?.fields.map((fieldConfig, index) => {
              // For email and password fields
              return (
                <div
                  key={`field-${fieldConfig.name}-${index}`}
                  className={styles.formGroup}
                >
                  <label htmlFor={fieldConfig.name}>{fieldConfig.label}:</label>
                  {fieldConfig.type === "select" ? (
                    <select
                      id={fieldConfig.name}
                      name={fieldConfig.name}
                      value={formData[fieldConfig.name] || ""}
                      onChange={handleInputChange}
                      className={styles.formSelect}
                    >
                      <option value="">Select {fieldConfig.label}</option>
                      {fieldConfig.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={fieldConfig.name}
                      name={fieldConfig.name}
                      value={formData[fieldConfig.name] || ""}
                      onChange={handleInputChange}
                      placeholder={fieldConfig.label}
                      className={styles.formInput}
                    />
                  )}
                  {errors[fieldConfig.name] && (
                    <span className={styles.errorText}>
                      {errors[fieldConfig.name]}
                    </span>
                  )}
                </div>
              );
            })}

            <div className={styles.formFooter}>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

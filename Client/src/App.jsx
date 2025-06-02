// Importing necessary React components
import Login from './pages/Login';  // Importing Login page component
import DashboardLayout from './layouts/DashboardLayout';  // Importing Dashboard Layout component
import UnauthorizedPage from './components/common/UnauthorizedPage';  // Importing Unauthorized page component
import Home from './pages/Home';  // Importing Home page component
import StudentDashboard from './pages/StudentDashboard';  // Importing Student Dashboard page component
import TeacherDashboard from './pages/TeacherDashboard';  // Importing Teacher Dashboard page component
import AdminDashboard from './pages/AdminDashboard';  // Importing Admin Dashboard page component
import CourseRegistration from './pages/CourseRegistration';  // Importing Course Registration page component
import StudentResult from './pages/StudentResult';  // Importing Student Result page component
import StudentFees from './pages/StudentFees';  // Importing Student Fees page component
import StudentCoursesMids from './pages/StudentCoursesMids';  // Importing Student Courses Mids page component
import StudentCoursesSummary from './pages/StudentCoursesSummary';  // Importing Student Courses Summary page component
import StudentSettings from './pages/StudentSettings';  // Importing Student Settings page component
import StudentAssignments from './pages/StudentAssignments';  // Importing Student Assignments page component
import TeacherPage from './pages/TeacherPage';  // Importing Teacher Page component
import AdminPage from './pages/AdminPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Importing React Router components for routing
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        {/* Defining all the routes and their respective components */}
        <Routes>
          {/* Default route - Home page */}
          <Route path="/" element={<Home />} />

          {/* Route for the Login page */}
          <Route path="/login" element={<Login />} />

          {/* Student Dashboard Routes */}
          <Route path="/student/*">
            <Route index element={<StudentDashboard />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            
            {/* Courses and its subroutes */}
            <Route path="courses">
              <Route path="mids" element={<StudentCoursesMids />} />
              <Route path="summary" element={<StudentCoursesSummary />} />
            </Route>

            <Route path="registration" element={<CourseRegistration />} />
            <Route path="result" element={<StudentResult />} />
            <Route path="fees" element={<StudentFees />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="settings" element={<StudentSettings />} />
          </Route>

          {/* Route for the Teacher Dashboard */}
          <Route path="/teacher/*" element={<TeacherPage />} />

          {/* Route for the Admin Dashboard */}
          <Route path="/admin/*" element={<AdminPage />} />

          {/* Fallback route - If no path matches, show Unauthorized page */}
          <Route path="*" element={<UnauthorizedPage />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

// Exporting the App component as the default export
export default App;

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
import StudentCoursesProceedings from './pages/StudentCoursesProceedings';  // Importing Student Courses Proceedings page component
import StudentCoursesIndex from './pages/StudentCoursesIndex';  // Importing Student Courses Index page component
import StudentSettings from './pages/StudentSettings';  // Importing Student Settings page component
import StudentAssignments from './pages/StudentAssignments';  // Importing Student Assignments page component
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Importing React Router components for routing

function App() {
  return (
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
            <Route index element={<StudentCoursesIndex />} />
            <Route path="mids" element={<StudentCoursesMids />} />
            <Route path="summary" element={<StudentCoursesSummary />} />
            <Route path="proceedings" element={<StudentCoursesProceedings />} />
          </Route>

          <Route path="registration" element={<CourseRegistration />} />
          <Route path="result" element={<StudentResult />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="settings" element={<StudentSettings />} />
        </Route>

        {/* Route for the Teacher Dashboard */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />

        {/* Route for the Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* Fallback route - If no path matches, show Unauthorized page */}
        <Route path="*" element={<UnauthorizedPage />} />
      </Routes>
    </Router>
  );
}

// Exporting the App component as the default export
export default App;

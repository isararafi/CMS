// Importing necessary React components
import Login from './pages/Login';  // Importing Login page component
import DashboardLayout from './layouts/DashboardLayout';  // Importing Dashboard Layout component
import UnauthorizedPage from './components/common/UnauthorizedPage';  // Importing Unauthorized page component
import Home from './pages/Home';  // Importing Home page component
import StudentDashboard from './pages/StudentDashboard';  // Importing Student Dashboard page component
import TeacherDashboard from './pages/TeacherDashboard';  // Importing Teacher Dashboard page component
import AdminDashboard from './pages/AdminDashboard';  // Importing Admin Dashboard page component
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

        {/* Route for the general dashboard layout */}
        <Route path="/dashboard" element={<DashboardLayout />} />
     

        {/* Route for the Student Dashboard */}
        <Route path="/student-dashboard" element={<StudentDashboard />} />

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

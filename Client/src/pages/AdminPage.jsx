import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ManageUserTemplate from '../components/ManageUserTemplate';

const AdminPage = () => (
  <Routes>
    <Route path="/" element={<AdminDashboard />} />
    <Route path="student/display" element={<AdminDashboard displayList="students" />} />
    <Route path="teacher/display" element={<AdminDashboard displayList="teachers" />} />
    <Route path="student/create" element={<ManageUserTemplate role="student" action="create" />} />
    <Route path="teacher/create" element={<ManageUserTemplate role="teacher" action="create" />} />
    {/* Default to dashboard if no subroute matches */}
    <Route path="*" element={<Navigate to="/admin" replace />} />
  </Routes>
);

export default AdminPage;

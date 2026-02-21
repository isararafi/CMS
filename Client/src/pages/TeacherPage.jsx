import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TeacherDashboard from './TeacherDashboard';
import TeacherMarks from './TeacherMarks';
import TeacherSettings from './TeacherSettings';

const TeacherPage = () => (
  <Routes>
    <Route path="/" element={<TeacherDashboard />}> 
      <Route path="marks" element={<TeacherMarks />} />
      <Route path="settings" element={<TeacherSettings />} />
    </Route>
  </Routes>
);

export default TeacherPage;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TeacherDashboard from './TeacherDashboard';
import TeacherAttendance from './TeacherAttendance';
import TeacherMarks from './TeacherMarks';
import TeacherAssignments from './TeacherAssignments';
import TeacherSettings from './TeacherSettings';

const TeacherPage = () => (
  <Routes>
    <Route path="/" element={<TeacherDashboard />}> 
      {/* <Route index element={<Navigate to="attendance" replace />} /> */}
      {/* <Route path="attendance" element={<TeacherAttendance />} /> */}
      <Route path="marks" element={<TeacherMarks />} />
      {/* <Route path="assignments" element={<TeacherAssignments />} /> */}
      <Route path="settings" element={<TeacherSettings />} />
    </Route>
  </Routes>
);

export default TeacherPage;

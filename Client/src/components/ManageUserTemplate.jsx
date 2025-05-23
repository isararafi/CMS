import React from 'react';

const ManageUserTemplate = ({ role, action }) => {
  const roleLabel = role === 'student' ? 'Student' : 'Teacher';
  const actionLabel = action.charAt(0).toUpperCase() + action.slice(1);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{actionLabel} {roleLabel}</h2>
      {/* Placeholder for form or logic for {actionLabel} {roleLabel} */}
      <div style={{ marginTop: '1rem', color: '#888' }}>
        This is a template for <b>{actionLabel} {roleLabel}</b>.<br />
        Implement the form or logic here.
      </div>
    </div>
  );
};

export default ManageUserTemplate; 
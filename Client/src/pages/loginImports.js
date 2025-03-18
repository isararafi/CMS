export const loginImportsAdmin = [
  { icon: ActiveAdmin, text: 'Admin Dashboard', href: '/admin-dashboard', iconActive: InactiveAdmin },
  { icon: ActiveUsers, text: 'Manage Users', href: '/manage-users', iconActive: InactiveUsers },
  { icon: ActivePermission, text: 'Roles & Permissions', href: '/admin-permissions', iconActive: inActivePermission },
  { icon: settings, text: 'Settings', href: '/admin-settings', iconActive: inActiveSetting },
];

export const loginImportsTeacher = [
  { icon: dashboard, text: 'Teacher Dashboard', href: '/teacher-dashboard', iconActive: activeDashboard },
  { icon: trans, text: 'Attendance', href: '/teacher-attendance' },
  { icon: manageEmployees, text: 'Manage Students', href: '/manage-students' },
  { icon: settings, text: 'Settings', href: '/teacher-settings' },
];

export const loginImportsStudent = [
  { icon: dashboard, text: 'Student Dashboard', href: '/student-dashboard', iconActive: activeDashboard },
  { icon: savings, text: 'Courses', href: '/student-courses', iconActive: activeSavings },
  { icon: shoppingCartIcon, text: 'Assignments', href: '/student-assignments', iconActive: shoppingCartActiveIcon },
  { icon: emergencyLoanIcon, text: 'Grades', href: '/student-grades', iconActive: emergencyLoanActiveIcon },
  { icon: discountIcon, text: 'Discounts', href: '/student-discounts', iconActive: discountActiveIcon },
];

const request = require('supertest');
const app = require('../src/index'); // Adjust this path based on your app's entry point
const mongoose = require('mongoose');
const User = require('../src/models/Admin'); // Adjust path as needed
const Student = require('../src/models/Student'); // Adjust path as needed

beforeAll(async () => {
  // Connect to a test database
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cms_test';
  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  // Cleanup the database and close connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clear all collections before each test
  await User.deleteMany({});
  await Student.deleteMany({});
});

describe('Authentication Tests', () => {
  describe('Login', () => {
    it('should login successfully with valid credentials', async () => {
      // Create a test user
      const testUser = await User.create({
        name: 'Test Admin',
        email: 'test@example.com',
        password: 'password123',
        role: 'admin'
      });

      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      // expect(response.body).toHaveProperty('user');
    });

    it('should fail login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });


  describe('Add Student', () => {
    let adminToken;

    beforeEach(async () => {
      // Create an admin user and get token
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });

      const loginResponse = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'admin@example.com',
          password: 'admin123'
        });

      adminToken = loginResponse.body.token;
    });

    it('should successfully add a new student', async () => {
      const studentData = {
        name: 'Test Student',
        email: 'student@example.com',
        rollNo: 'R123',
        department: 'Computer Science',
        password: 'testpass123',
        semester: 1,
        batch: '2022'
      };

      const response = await request(app)
        .post('/api/admin/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(studentData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.email).toBe(studentData.email);
    });

    it('should fail to add student without authentication', async () => {
      const studentData = {
        name: 'Test Student',
        email: 'student@example.com',
        rollNumber: 'R123',
        department: 'Computer Science'
      };

      const response = await request(app)
        .post('/api/student')
        .send(studentData);

      expect(response.status).toBe(401);
    });
  });

  describe('Change Password', () => {
    let userToken;
    let userId;
    const studentData = {
      name: 'testuser',
      email: 'user@example.com',
      password: 'oldpassword123',
      batch: '2022',
      department: 'Computer Science',
      rollNo: 'R001',
      semester: 1
    };

    beforeEach(async () => {
      // Create a test student with all required fields
      const user = await Student.create(studentData);
      userId = user._id;

      // Login as student using correct endpoint and fields
      const loginResponse = await request(app)
        .post('/api/student/login')
        .send({
          batch: studentData.batch,
          department: studentData.department,
          rollNo: studentData.rollNo,
          password: studentData.password
        });

      userToken = loginResponse.body.token;
    });

    it('should successfully change password', async () => {
      const response = await request(app)
        .put('/api/student/profile/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'oldpassword123',
          newPassword: 'newpassword123',
          confirmNewPassword: 'newpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Password changed successfully');

      // Verify can login with new password
      const loginResponse = await request(app)
        .post('/api/student/login')
        .send({
          batch: studentData.batch,
          department: studentData.department,
          rollNo: studentData.rollNo,
          password: 'newpassword123'
        });

      expect(loginResponse.status).toBe(200);
    });

    it('should fail to change password with incorrect current password', async () => {
      const response = await request(app)
        .put('/api/student/profile/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123',
          confirmNewPassword: 'newpassword123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});

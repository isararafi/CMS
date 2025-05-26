const request = require('supertest');
const app = require('../app'); // Adjust this path based on your app's entry point
const mongoose = require('mongoose');
const User = require('../models/User'); // Adjust path as needed
const Student = require('../models/Student'); // Adjust path as needed

beforeAll(async () => {
  // Connect to a test database
  const mongoURI = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/cms_test';
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
        email: 'test@example.com',
        password: 'password123',
        role: 'admin'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });

    it('should fail login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
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
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });

      const loginResponse = await request(app)
        .post('/api/auth/login')
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
        rollNumber: 'R123',
        department: 'Computer Science'
      };

      const response = await request(app)
        .post('/api/students')
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
        .post('/api/students')
        .send(studentData);

      expect(response.status).toBe(401);
    });
  });

  describe('Change Password', () => {
    let userToken;
    let userId;

    beforeEach(async () => {
      // Create a test user
      const user = await User.create({
        email: 'user@example.com',
        password: 'oldpassword123',
        role: 'user'
      });

      userId = user._id;

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'oldpassword123'
        });

      userToken = loginResponse.body.token;
    });

    it('should successfully change password', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'oldpassword123',
          newPassword: 'newpassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Password updated successfully');

      // Verify can login with new password
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'newpassword123'
        });

      expect(loginResponse.status).toBe(200);
    });

    it('should fail to change password with incorrect current password', async () => {
      const response = await request(app)
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 
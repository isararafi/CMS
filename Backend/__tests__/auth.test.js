const request = require('supertest');
const app = require('../src/index'); // Adjust this path based on your app's entry point
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin'); // Adjust path as needed
const Student = require('../src/models/Student'); // Adjust path as needed

beforeAll(async () => {
  // Connect to a test database
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cms_test';
  await mongoose.connect(mongoURI);

  // await Admin.deleteMany({}, { timeout: 50000 });
  await Admin.create({
    name: 'Test Admin',
    email: 'test@example.com',
    password: 'password123',
    role: 'admin'
  });
}, 500000);

afterAll(async () => {
  //  close connection
  await mongoose.connection.close();
}, 50000);

// beforeEach(async () => {
//   // Clear all collections before each test
//   await Admin.deleteMany({});
//   await Student.deleteMany({});
// }, 50000);

describe('Authentication Tests', () => {
  let adminToken;
  describe('Login', () => {
    it('should login successfully with valid credentials', async () => {
    
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      adminToken = response.body.token;
    }, 50000);

    it('should fail login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    }, 50000);

    it('should fail login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    }, 50000);

    it('should fail login with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/admin/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    }, 50000);
  });


  describe('Add Student', () => {
    // beforeEach(async () => {
    //   // Create an admin Admin and get token
    //   const admin = await Admin.create({
    //     name: 'Admin',
    //     email: 'admin@gmail.com',
    //     password: 'admin123',
    //     role: 'admin'
    //   });

    //   const loginResponse = await request(app)
    //     .post('/api/admin/login')
    //     .send({
    //       email: 'admin@gmail.com',
    //       password: 'admin123'
    //     });

    //   adminToken = loginResponse.body.token;
    // });

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
        .post('/api/admin/register/student')
        .set('Authorization', `Bearer ${adminToken}`)//important
        .send(studentData);

      expect(response.status).toBe(201);
      expect(response.body.student).toHaveProperty('_id');
      expect(response.body.student.email).toBe(studentData.email);
    }, 500000);

    it('should fail to add student without authentication', async () => {
      const studentData = {
        name: 'dummy',
        email: 'dummy@gmail.com',
        rollNo: '99',
        department: 'Computer Science',
        password: 'password',
        semester: 1,
        batch: '2022'
      };

      const response = await request(app)
        .post('/api/admin/register/student')
        .send(studentData);

      console.log(response.body);
      expect(response.status).toBe(401);
    }, 500000);
  });

  describe('Change Password', () => {
    let UserToken;
    

    beforeEach(async () => {

      // Login as student using correct endpoint and fields
      const loginResponse = await request(app)
        .post('/api/student/login')
        .send({
          batch: '2022',
          department: 'Computer Science',
          rollNo: 'R123',
          password: 'password123'
        });

      UserToken = loginResponse.body.token;
    });

    it('should successfully change password', async () => {
      const response = await request(app)
        .put('/api/student/profile/change-password')
        .set('Authorization', `Bearer ${UserToken}`)
        .send({
          currentPassword: 'password123',
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
        .set('Authorization', `Bearer ${UserToken}`)
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

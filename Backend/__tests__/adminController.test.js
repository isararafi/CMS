const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const { registerAdmin, login, getAdminInfo, updateProfile, getDashboardStats, registerStudent } = require('../src/controllers/adminController');
const Admin = require('../src/models/Admin');
const Student = require('../src/models/Student');
const Teacher = require('../src/models/Teacher');

// Mock Admin model
jest.mock('../src/models/Admin');
jest.mock('../src/models/Student');
jest.mock('../src/models/Teacher');
jest.mock('jsonwebtoken');

describe('Admin Controller - registerAdmin', () => {

    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
    });

    // ❌ 1️⃣ Missing fields
    it('should return 400 if required fields are missing', async () => {

        req.body = { email: 'admin@test.com' };

        await registerAdmin(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            error: 'All fields are required'
        });
    });

    // ❌ 2️⃣ Email already exists
    it('should return 400 if email is already registered', async () => {

        req.body = {
            name: 'Admin',
            email: 'admin@test.com',
            password: '123456'
        };

        Admin.findOne = jest.fn().mockResolvedValue({ email: 'admin@test.com' });

        await registerAdmin(req, res);

        expect(Admin.findOne).toHaveBeenCalledWith({ email: 'admin@test.com' });
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            error: 'Email already registered'
        });
    });

    // ✅ 3️⃣ Successful registration
    it('should register admin successfully', async () => {

        req.body = {
            name: 'Admin',
            email: 'admin@test.com',
            password: '123456'
        };

        // Email not found
        Admin.findOne = jest.fn().mockResolvedValue(null);

        const saveMock = jest.fn().mockResolvedValue(true);

        Admin.mockImplementation(() => ({
            _id: 'admin123',
            name: 'Admin',
            email: 'admin@test.com',
            save: saveMock
        }));

        await registerAdmin(req, res);

        expect(saveMock).toHaveBeenCalled();
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({
            message: 'Admin registered successfully',
            admin: {
                id: 'admin123',
                name: 'Admin',
                email: 'admin@test.com'
            }
        });
    });

    // ❌ 4️⃣ Server error
    it('should return 500 if server error occurs', async () => {

        req.body = {
            name: 'Admin',
            email: 'admin@test.com',
            password: '123456'
        };

        Admin.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

        await registerAdmin(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({
            error: 'Server error',
            details: 'Database error'
        });
    });

});

describe('Admin Controller - login', () => {

    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
    });

    // ❌ 1️⃣ Admin not found
    it('should return 401 if admin does not exist', async () => {
        req.body = { email: 'admin@test.com', password: '123456' };

        Admin.findOne.mockResolvedValue(null);

        await login(req, res);

        expect(Admin.findOne).toHaveBeenCalledWith({ email: 'admin@test.com' });
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({ error: 'Invalid credentials' });
    });

    // ❌ 2️⃣ Wrong password
    it('should return 401 if password is incorrect', async () => {
        req.body = { email: 'admin@test.com', password: 'wrongpass' };

        const mockAdmin = { comparePassword: jest.fn().mockResolvedValue(false) };
        Admin.findOne.mockResolvedValue(mockAdmin);

        await login(req, res);

        expect(mockAdmin.comparePassword).toHaveBeenCalledWith('wrongpass');
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({ error: 'Invalid credentials' });
    });

    // ✅ 3️⃣ Successful login
    it('should return token if login is successful', async () => {
        req.body = { email: 'admin@test.com', password: '123456' };

        const mockAdmin = {
            _id: 'admin123',
            comparePassword: jest.fn().mockResolvedValue(true)
        };
        Admin.findOne.mockResolvedValue(mockAdmin);

        jwt.sign.mockReturnValue('fake-jwt-token');
        process.env.JWT_SECRET = 'testsecret';

        await login(req, res);

        expect(jwt.sign).toHaveBeenCalledWith(
            { id: 'admin123' },
            'testsecret',
            { expiresIn: '24h' }
        );

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            token: 'fake-jwt-token',
            message: 'Login successful'
        });
    });

    // ❌ 4️⃣ Server error
    it('should return 500 if server error occurs', async () => {
        req.body = { email: 'admin@test.com', password: '123456' };

        Admin.findOne.mockRejectedValue(new Error('Database error'));

        await login(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'Server error' });
    });

});

describe('Admin Controller - getAdminInfo', () => {

    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
    });

    // ✅ 1️⃣ Successfully fetch admin info
    it('should return admin info without password', async () => {
        req.admin = { _id: 'admin123' };

        const selectMock = jest.fn().mockResolvedValue({
            _id: 'admin123',
            name: 'Admin User',
            email: 'admin@test.com'
        });

        Admin.findById.mockReturnValue({ select: selectMock });

        await getAdminInfo(req, res);

        expect(Admin.findById).toHaveBeenCalledWith('admin123');
        expect(selectMock).toHaveBeenCalledWith('-password');
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            _id: 'admin123',
            name: 'Admin User',
            email: 'admin@test.com'
        });
    });

    // ❌ 2️⃣ Server error
    it('should return 500 if server error occurs', async () => {
        req.admin = { _id: 'admin123' };

        const selectMock = jest.fn().mockRejectedValue(new Error('Database error'));
        Admin.findById.mockReturnValue({ select: selectMock });

        await getAdminInfo(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'Server error' });
    });

});

describe('Admin Controller - updateProfile', () => {

    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
    });

    // ✅ 1️⃣ Successful profile update
    it('should update profile successfully', async () => {
        req.admin = { _id: 'admin123' };
        req.body = { name: 'New Admin', password: 'newpass123' };

        const saveMock = jest.fn().mockResolvedValue(true);
        const mockAdmin = { save: saveMock };

        Admin.findById.mockResolvedValue(mockAdmin);

        await updateProfile(req, res);

        expect(Admin.findById).toHaveBeenCalledWith('admin123');
        expect(mockAdmin.name).toBe('New Admin');
        expect(mockAdmin.password).toBe('newpass123');
        expect(saveMock).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: 'Profile updated successfully' });
    });

    // ❌ 2️⃣ Invalid update fields
    it('should return 400 if updates contain invalid fields', async () => {
        req.admin = { _id: 'admin123' };
        req.body = { email: 'newemail@test.com' }; // email is not allowed

        await updateProfile(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ error: 'Invalid updates' });
    });

    // ❌ 3️⃣ Error while saving
    it('should return 400 if saving admin fails', async () => {
        req.admin = { _id: 'admin123' };
        req.body = { name: 'Admin Error' };

        const saveMock = jest.fn().mockRejectedValue(new Error('Database error'));
        const mockAdmin = { save: saveMock };

        Admin.findById.mockResolvedValue(mockAdmin);

        await updateProfile(req, res);

        expect(saveMock).toHaveBeenCalled();
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ error: 'Database error' });
    });

});

describe('Admin Controller - getDashboardStats', () => {

    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
    });

    // ✅ 1️⃣ Successfully fetch dashboard stats
    it('should return studentsCount and teachersCount', async () => {

        Student.countDocuments.mockResolvedValue(10);
        Teacher.countDocuments.mockResolvedValue(5);

        await getDashboardStats(req, res);

        expect(Student.countDocuments).toHaveBeenCalled();
        expect(Teacher.countDocuments).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            studentsCount: 10,
            teachersCount: 5
        });
    });

    // ❌ 2️⃣ Server error
    it('should return 500 if an error occurs', async () => {

        Student.countDocuments.mockRejectedValue(new Error('Database error'));
        Teacher.countDocuments.mockResolvedValue(5); // even if teacher succeeds

        await getDashboardStats(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'Server error' });
    });

});

describe('Admin Controller - registerStudent', () => {

    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
    });

    // ❌ 1️⃣ Missing required fields
    it('should return 400 if required fields are missing', async () => {
        req.body = { name: 'Ali', email: 'ali@test.com' }; // incomplete

        await registerStudent(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ error: 'Required fields missing' });
    });

    // ❌ 2️⃣ Invalid semester
    it('should return 400 if semester is invalid', async () => {
        req.body = {
            name: 'Ali',
            email: 'ali@test.com',
            password: '123456',
            rollNo: 'R001',
            semester: 10, // invalid
            department: 'CS',
            batch: '2023'
        };

        await registerStudent(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ error: 'Semester must be between 1 and 8' });
    });

    // ❌ 3️⃣ Student already exists
    it('should return 400 if student with email or rollNo already exists', async () => {
        req.body = {
            name: 'Ali',
            email: 'ali@test.com',
            password: '123456',
            rollNo: 'R001',
            semester: 4,
            department: 'CS',
            batch: '2023'
        };

        Student.findOne = jest.fn().mockResolvedValue({ email: 'ali@test.com' });

        await registerStudent(req, res);

        expect(Student.findOne).toHaveBeenCalledWith({ $or: [{ email: 'ali@test.com' }, { rollNo: 'R001' }] });
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({ error: 'Student with this email or roll number already exists' });
    });

    // ✅ 4️⃣ Successful registration
    it('should register student successfully', async () => {
        req.body = {
            name: 'Ali',
            email: 'ali@test.com',
            password: '123456',
            rollNo: 'R001',
            semester: 4,
            department: 'CS',
            batch: '2023'
        };

        // No existing student
        Student.findOne = jest.fn().mockResolvedValue(null);

        const saveMock = jest.fn().mockResolvedValue(true);

        Student.mockImplementation(() => ({
            _id: 'student123',
            ...req.body,
            save: saveMock
        }));

        await registerStudent(req, res);

        expect(saveMock).toHaveBeenCalled();
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({
            message: 'Student registered successfully',
            student: {
                id: 'student123',
                name: 'Ali',
                email: 'ali@test.com',
                rollNo: 'R001',
                semester: 4,
                department: 'CS'
            }
        });
    });

    // ❌ 5️⃣ Server error
    it('should return 500 if server error occurs', async () => {
        req.body = {
            name: 'Ali',
            email: 'ali@test.com',
            password: '123456',
            rollNo: 'R001',
            semester: 4,
            department: 'CS',
            batch: '2023'
        };

        Student.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

        await registerStudent(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ error: 'Server error' });
    });

});

const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const { registerAdmin, login, addStudent, addTeacher } = require('../src/controllers/adminController');
const Admin = require('../src/models/Admin');
const Student = require('../src/models/Student');
const Teacher = require('../src/models/Teacher');

// Mock Admin model
jest.mock('../src/models/Admin');
jest.mock('../src/models/Student');
jest.mock('../src/models/Teacher');
jest.mock('jsonwebtoken');

describe('registerAdmin Controller', () => {

    let req, res;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        jest.clearAllMocks();
    });

    // ✅ 1. Should return 400 if fields missing
    it('should return 400 if required fields are missing', async () => {
        req.body = { email: 'test@test.com' };

        await registerAdmin(req, res);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            error: 'All fields are required'
        });
    });

    // ✅ 2. Should return 400 if email already exists
    it('should return 400 if email already registered', async () => {
        req.body = {
            name: 'Test',
            email: 'test@test.com',
            password: '123456'
        };

        Admin.findOne.mockResolvedValue({ email: 'test@test.com' });

        await registerAdmin(req, res);

        expect(Admin.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            error: 'Email already registered'
        });
    });

    // ✅ 3. Should register admin successfully
    it('should register admin successfully', async () => {
        req.body = {
            name: 'Test',
            email: 'test@test.com',
            password: '123456'
        };

        Admin.findOne.mockResolvedValue(null);

        const saveMock = jest.fn().mockResolvedValue(true);

        Admin.mockImplementation(() => ({
            _id: '12345',
            name: 'Test',
            email: 'test@test.com',
            save: saveMock
        }));

        await registerAdmin(req, res);

        expect(saveMock).toHaveBeenCalled();
        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({
            message: 'Admin registered successfully',
            admin: {
                id: '12345',
                name: 'Test',
                email: 'test@test.com'
            }
        });
    });

    // ✅ 4. Should return 500 if server error occurs
    it('should return 500 if server error occurs', async () => {
        req.body = {
            name: 'Test',
            email: 'test@test.com',
            password: '123456'
        };

        Admin.findOne.mockRejectedValue(new Error('Database error'));

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

    // ✅ 1️⃣ Admin not found
    it('should return 401 if admin does not exist', async () => {
        req.body = {
            email: 'admin@test.com',
            password: '123456'
        };

        Admin.findOne.mockResolvedValue(null);

        await login(req, res);

        expect(Admin.findOne).toHaveBeenCalledWith({ email: 'admin@test.com' });
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({
            error: 'Invalid credentials'
        });
    });

    // ✅ 2️⃣ Wrong password
    it('should return 401 if password is incorrect', async () => {
        req.body = {
            email: 'admin@test.com',
            password: 'wrongpass'
        };

        const mockAdmin = {
            comparePassword: jest.fn().mockResolvedValue(false)
        };

        Admin.findOne.mockResolvedValue(mockAdmin);

        await login(req, res);

        expect(mockAdmin.comparePassword).toHaveBeenCalledWith('wrongpass');
        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({
            error: 'Invalid credentials'
        });
    });

    // ✅ 3️⃣ Successful login
    it('should return token if login is successful', async () => {
        req.body = {
            email: 'admin@test.com',
            password: '123456'
        };

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

    // ✅ 4️⃣ Server error
    it('should return 500 if server error occurs', async () => {
        req.body = {
            email: 'admin@test.com',
            password: '123456'
        };

        Admin.findOne.mockRejectedValue(new Error('Database error'));

        await login(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({
            error: 'Server error'
        });
    });

});




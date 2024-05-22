const fs = require('fs');
const path = require('path');

const handleLogin = require('../src/user_actions/login');
const { mockRequest, mockResponse } = require('jest-mock-req-res');

jest.mock('fs');
jest.mock('../src/utils/password_handler.js');

const USERS_FILE = path.join(__dirname, '../src/users.json');
//console.log(USERS_FILE)

describe('handleLogin', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if username or password is missing', () => {
        const req = mockRequest({
            body: {
                username: '',
                password: ''
            }
        });
        const res = mockResponse();

        handleLogin(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Username and password are required');
    });

    it('should return 500 if reading users file fails', () => {
        const req = mockRequest({
            body: {
                username: 'testuser',
                password: 'testpassword'
            }
        });
        const res = mockResponse();

        fs.readFile.mockImplementation((path, encoding, callback) => {
            callback(new Error('Read error'), null);
        });

        handleLogin(req, res);

        expect(fs.readFile).toHaveBeenCalledWith(USERS_FILE, 'utf8', expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal server error');
    });

    it('should return 400 if user does not exist', () => {
        const req = mockRequest({
            body: {
                username: 'nonexistentuser',
                password: 'testpassword'
            }
        });
        const res = mockResponse();

        fs.readFile.mockImplementation((path, encoding, callback) => {
            callback(null, JSON.stringify([])); // No users in the file
        });

        handleLogin(req, res);

        expect(fs.readFile).toHaveBeenCalledWith(USERS_FILE, 'utf8', expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Invalid username or password');
    });

    it('should return 400 if password is invalid', async () => {
        const req = mockRequest({
            body: {
                username: 'testuser',
                password: 'wrongpassword'
            }
        });
        const res = mockResponse();

        fs.readFile.mockImplementation((path, encoding, callback) => {
            callback(null, JSON.stringify([{ username: 'testuser', password: 'hashedpassword' }]));
        });

        require('../src/utils/password_handler.js').checkPassword.mockResolvedValue(false); // Mock password check

        await handleLogin(req, res);
        // Log the response status and send
        //console.log('Response Status:', res.status.mock.calls);
        //console.log('Response Send:', res.send.mock.calls);
        expect(fs.readFile).toHaveBeenCalledWith(USERS_FILE, 'utf8', expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Invalid username or password');
    });

    it('should set return 200 if login is successful', async () => {
        const req = mockRequest({
            body: {
                username: 'testuser',
                password: 'testpassword'
            }
        });
        const res = mockResponse();

        fs.readFile.mockImplementation((path, encoding, callback) => {
            callback(null, JSON.stringify([{ username: 'testuser', password: 'hashedpassword' }]));
        });
        require('../src/utils/password_handler').checkPassword.mockResolvedValue(true); // Mock password check

        await handleLogin(req, res);

        expect(fs.readFile).toHaveBeenCalledWith(USERS_FILE, 'utf8', expect.any(Function));
        expect(res.cookie).toHaveBeenCalledWith('username', 'testuser', { httpOnly: false, secure: false, maxAge: 3600000 });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith('Login successful');
    });
});

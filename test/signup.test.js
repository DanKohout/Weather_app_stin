const fs = require('fs');
const path = require('path');
const handleSignup = require('../src/user_actions/signup');
const { hashPassword } = require('../src/utils/password_handler');
const { mockRequest, mockResponse } = require('jest-mock-req-res');

jest.mock('fs');
jest.mock('../src/utils/password_handler');

const USERS_FILE = path.join(__dirname, '/../src/users.json');
//console.log(USERS_FILE)
describe('handleSignup', () => {
    let req;
    let res;

    beforeEach(() => {
        req = mockRequest({
            body: {
                usernameVal: 'testuser',
                passwordVal: 'testpassword',
                cardHolderVal: 'Test Holder',
                cardNumVal: '1234567890123456',
                expDatVal: '11/28',
                cvvVal: '123'
            }
        });

        res = mockResponse({
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if any field is missing', async () => {
        req.body.usernameVal = '';

        await handleSignup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('All fields are required (server side)');
    });

    it('should return 400 if payment fails', async () => {
        req.body.cvvVal = '1';
        await handleSignup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Payment failed');
    });

    it('should return 400 if user already exists', async () => {
        const users = [{ username: 'testuser', password: 'hashedpassword' }];
        await fs.readFile.mockImplementation((path, encoding, callback) => {
            callback(null, JSON.stringify(users));
        });

        await handleSignup(req, res);

        expect(res.send).toHaveBeenCalledWith('User already exists');
        expect(res.status).toHaveBeenCalledWith(400);
        expect(fs.readFile).toHaveBeenCalledWith(USERS_FILE, 'utf8', expect.any(Function));
        
    });

    it('should return 500 if reading users file fails', async () => {

        await fs.readFile.mockImplementation((path, encoding, callback) => {
            callback(new Error('Read error'), null);
        });

        await handleSignup(req, res);

        expect(res.send).toHaveBeenCalledWith('Internal server error');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(fs.readFile).toHaveBeenCalledWith(USERS_FILE, 'utf8', expect.any(Function));
        
    });

    it('should return 500 if writing users file fails', async () => {
        const users = [];
        await fs.readFile.mockImplementation((path, encoding, callback) => {
            callback(null, JSON.stringify(users));
        });
        await fs.writeFile.mockImplementation((path, data, encoding, callback) => {
            callback(new Error('Write error'));
        });
        hashPassword.mockResolvedValue('hashedpassword');

        await handleSignup(req, res);

        expect(fs.readFile).toHaveBeenCalledWith(USERS_FILE, 'utf8', expect.any(Function));
        expect(hashPassword).toHaveBeenCalledWith('testpassword');
        expect(fs.writeFile).toHaveBeenCalledWith(USERS_FILE, JSON.stringify([{ username: 'testuser', password: 'hashedpassword' }], null, 2), 'utf8', expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal server error');
    });

    it('should register a new user successfully', async () => {
        const users = [];
        fs.readFile.mockImplementation((path, encoding, callback) => {
            callback(null, JSON.stringify(users));
        });
        fs.writeFile.mockImplementation((path, data, encoding, callback) => {
            callback(null);
        });
        hashPassword.mockResolvedValue('hashedpassword');

        await handleSignup(req, res);

        expect(fs.readFile).toHaveBeenCalledWith(USERS_FILE, 'utf8', expect.any(Function));
        expect(hashPassword).toHaveBeenCalledWith('testpassword');
        expect(fs.writeFile).toHaveBeenCalledWith(USERS_FILE, JSON.stringify([{ username: 'testuser', password: 'hashedpassword' }], null, 2), 'utf8', expect.any(Function));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith('User registered successfully');
    });

    it('should return 500 if hashing password fails', async () => {
        hashPassword.mockRejectedValue(new Error('Hashing error'));

        await handleSignup(req, res);

        expect(fs.readFile).toHaveBeenCalledWith(USERS_FILE, 'utf8', expect.any(Function));
        expect(hashPassword).toHaveBeenCalledWith('testpassword');
        expect(fs.writeFile).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Error hashing password');
    });

    
});

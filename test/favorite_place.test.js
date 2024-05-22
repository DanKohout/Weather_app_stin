const fs = require('fs');
const { getFavoritePlace, setFavoritePlace } = require('../src/user_actions/favorite_place');
const path = require('path');
const USERS_FILE = path.join(__dirname, '/../src/users.json');

jest.mock('fs');

describe('getFavoritePlace', () => {
    it('should return favorite place of a user', (done) => {
        
        const mockUsers = [
            { username: 'asdf', favorite_place: 'liberec' },
            { username: 'testuser', favorite_place: 'testplace' }
        ];
        fs.readFile.mockImplementation((file, encoding, callback) => {
            callback(null, JSON.stringify(mockUsers));
        });

        const req = { query: { username: 'asdf' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        getFavoritePlace(req, res);

        process.nextTick(() => {
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ location: 'liberec' });
            done();
        });
    });

    it('should return empty string if user has no favorite place', (done) => {
        
        const mockUsers = [
            { username: 'asdf' },
            { username: 'testuser', favorite_place: 'testplace' }
        ];
        fs.readFile.mockImplementation((file, encoding, callback) => {
            callback(null, JSON.stringify(mockUsers));
        });

        const req = { query: { username: 'asdf' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        getFavoritePlace(req, res);

        process.nextTick(() => {
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ location: '' });
            done();
        });
    });

    it('should return 400 if username is not provided', () => {
        const req = { query: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        getFavoritePlace(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Username is required');
    });

    it('should return 400 if user is not found', (done) => {
        
        const mockUsers = [
            { username: 'testuser', favorite_place: 'testplace' }
        ];
        fs.readFile.mockImplementation((file, encoding, callback) => {
            callback(null, JSON.stringify(mockUsers));
        });

        const req = { query: { username: 'asdf' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        getFavoritePlace(req, res);

        process.nextTick(() => {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('User not found');
            done();
        });
    });

    it('should return 500 if there is a server error', (done) => {
        
        fs.readFile.mockImplementation((file, encoding, callback) => {
            callback(new Error('Server error'));
        });

        const req = { query: { username: 'asdf' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        getFavoritePlace(req, res);

        process.nextTick(() => {
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal server error');
            done();
        });
    });
});

describe('setFavoritePlace', () => {
    it('should update favorite place of a user', (done) => {
        
        const mockUsers = [
            { username: 'asdf', favorite_place: 'oldplace' },
            { username: 'testuser', favorite_place: 'testplace' }
        ];
        fs.readFile.mockImplementation((file, encoding, callback) => {
            callback(null, JSON.stringify(mockUsers));
        });
        fs.writeFile.mockImplementation((file, data, encoding, callback) => {
            callback(null);
        });

        const req = { query: { username: 'asdf', favoritePlace: 'newplace' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        setFavoritePlace(req, res);

        process.nextTick(() => {
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith('Favorite place updated successfully');
            done();
        });
    });

    it('should return 400 if username or favorite place is not provided', () => {
        const req = { query: { username: 'asdf' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        setFavoritePlace(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Username and favorite place are required');
    });

    it('should return 400 if user is not found', (done) => {
        
        const mockUsers = [
            { username: 'testuser', favorite_place: 'testplace' }
        ];
        fs.readFile.mockImplementation((file, encoding, callback) => {
            callback(null, JSON.stringify(mockUsers));
        });

        const req = { query: { username: 'asdf', favoritePlace: 'newplace' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        setFavoritePlace(req, res);

        process.nextTick(() => {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('User not found');
            done();
        });
    });

    it('should return 500 if there is a server error while reading', (done) => {
        
        fs.readFile.mockImplementation((file, encoding, callback) => {
            callback(new Error('Server error'));
        });

        const req = { query: { username: 'asdf', favoritePlace: 'newplace' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        setFavoritePlace(req, res);

        process.nextTick(() => {
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal server error');
            done();
        });
    });

    it('should return 500 if there is a server error while writing', (done) => {
        
        const mockUsers = [
            { username: 'asdf', favorite_place: 'oldplace' },
            { username: 'testuser', favorite_place: 'testplace' }
        ];
        fs.readFile.mockImplementation((file, encoding, callback) => {
            callback(null, JSON.stringify(mockUsers));
        });
        fs.writeFile.mockImplementation((file, data, encoding, callback) => {
            callback(new Error('Server error'));
        });

        const req = { query: { username: 'asdf', favoritePlace: 'newplace' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        setFavoritePlace(req, res);

        process.nextTick(() => {
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith('Internal server error');
            done();
        });
    });
});

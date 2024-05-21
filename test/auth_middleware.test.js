const authMiddleware = require('../src/utils/auth_middleware');
const { mockRequest, mockResponse } = require('jest-mock-req-res');

describe('authMiddleware', () => {
    it('should call next() if username cookie exists', () => {
        const req = mockRequest({
            cookies: { username: 'testuser' }
        });
        const res = mockResponse();
        const next = jest.fn();

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return 401 and render custom 401 page if username cookie does not exist', () => {
        const req = mockRequest({
            cookies: {}
        });
        const res = mockResponse();

        authMiddleware(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.render).toHaveBeenCalledWith('401', {
            title: '401',
            name: 'Dakoh Kodah',
            errorMessage: 'Unauthorized'
        });
    });
});

const bcrypt = require('bcryptjs');
const passwordHandler = require('../src/utils/password_handler');

describe('password_handler', () => {
    describe('hashPassword', () => {
        it('should hash the password correctly', async () => {
            const password = 'password123';
            const hashedPassword = await passwordHandler.hashPassword(password);

            expect(hashedPassword).toBeDefined();
            expect(typeof hashedPassword).toBe('string');
            expect(hashedPassword.length).toBeGreaterThan(0);
        });
    });

    describe('checkPassword', () => {
        it('should return true if the password matches the hashed password', async () => {
            const password = 'password123';
            const hashedPassword = await bcrypt.hash(password, 10);

            const isMatch = await passwordHandler.checkPassword(password, hashedPassword);
            
            expect(isMatch).toBe(true);
        });

        it('should return false if the password does not match the hashed password', async () => {
            const password = 'password123';
            const wrongPassword = 'wrongpassword';
            const hashedPassword = await bcrypt.hash(password, 10);

            const isMatch = await passwordHandler.checkPassword(wrongPassword, hashedPassword);
            
            expect(isMatch).toBe(false);
        });
    });
});

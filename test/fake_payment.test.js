const fakePayment = require('../src/utils/fake_payment');

// Mock the console.error function
console.error = jest.fn();

describe('fakePayment', () => {
    it('should return true if all inputs are valid', () => {
        const result = fakePayment('John Doe', '1234567890123456', '12/28', '123');
        expect(result).toBe(true);
    });

    it('should return false if any input is invalid', () => {
        // Test with invalid card number
        let result = fakePayment('John Doe', '12345678901234', '12/28', '123');
        expect(result).toBe(false);
        //expect(console.error).toHaveBeenCalledWith('Invalid card number:', '12345678901234');

        // Test with invalid expiration date
        result = fakePayment('John Doe', '1234567890123456', '13/23', '123');
        expect(result).toBe(false);
        //expect(console.error).toHaveBeenCalledWith('Invalid expiration date:', '13/23');

        // Test with invalid CVV
        result = fakePayment('John Doe', '1234567890123456', '12/28', '12');
        expect(result).toBe(false);
        //expect(console.error).toHaveBeenCalledWith('Invalid CVV:', '12');
    });

    // Add more test cases as needed
});


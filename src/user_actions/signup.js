
const fs = require('fs');
const path = require('path');
const USERS_FILE = path.join(__dirname, '/../users.json');
const fakePayment = require('../utils/fake_payment.js');
const { hashPassword } = require('../utils/password_handler.js');


const handleSignup = async(req, res) => {
    const { usernameVal: username, passwordVal: password, cardHolderVal: cardholderName, cardNumVal: cardNumber, expDatVal: expDate, cvvVal: cvv } = req.body;

    if (!username || !password || !cardholderName || !cardNumber || !expDate || !cvv) {
        console.log("signup failed, data:")
        console.log(username)
        console.log(req.body)
        return res.status(400).send('All fields are required (server side)');
    }

    // Fake payment check
    const paymentSuccess = fakePayment(cardholderName, cardNumber, expDate, cvv);
    if (!paymentSuccess) {
        return res.status(400).send('Payment failed');
    }

    // Read the existing users from the JSON file
    fs.readFile(USERS_FILE, 'utf8', async (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }

        const users = JSON.parse(data);

        // Check if the user already exists by username
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Hash the password
        try {
            const hashedPassword = await hashPassword(password);

            // Add the new user with hashed password
            const newUser = { username, password: hashedPassword};
            users.push(newUser);

            // Write the updated users back to the JSON file
            fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal server error');
                }
                res.status(201).send('User registered successfully');
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error hashing password');
        }
    });
};

module.exports = handleSignup;

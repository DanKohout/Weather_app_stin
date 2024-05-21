const fs = require('fs');
const path = require('path');
const USERS_FILE = path.join(__dirname, '/../users.json');
const fakePayment = require('../utils/fake_payment.js');
const { hashPassword } = require('../utils/password_handler.js');

const handleSignup = async (req, res) => {
    const { usernameVal: username, passwordVal: password, cardHolderVal: cardholderName, cardNumVal: cardNumber, expDatVal: expDate, cvvVal: cvv } = req.body;

    if (!username || !password || !cardholderName || !cardNumber || !expDate || !cvv) {
        return res.status(400).send('All fields are required (server side)');
    }

    let paymentSuccess = fakePayment(cardholderName, cardNumber, expDate, cvv);
    //console.log("paymentSuccess: ",paymentSuccess, " cardholderName:", cardholderName, " cardNumber: ",cardNumber," expDate:",expDate, " cvv:",cvv)
    if (!paymentSuccess) {
        return res.status(400).send('Payment failed');
    }

    fs.readFile(USERS_FILE, 'utf8', async (err, data) => {
        if (err) {
            //console.error(err);
            return res.status(500).send('Internal server error');
        }

        const users = JSON.parse(data);

        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        try {
            const hashedPassword = await hashPassword(password);

            const newUser = { username, password: hashedPassword };
            users.push(newUser);

            fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8', (err) => {
                if (err) {
                    //console.error(err);
                    return res.status(500).send('Internal server error');
                }
                res.status(201).send('User registered successfully');
            });
        } catch (error) {
            //console.error(error);
            res.status(500).send('Error hashing password');
        }
    });
};

module.exports = handleSignup;

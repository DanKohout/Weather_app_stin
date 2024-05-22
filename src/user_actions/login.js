
const fs = require('fs');
const path = require('path');
const { checkPassword } = require('../utils/password_handler');
const USERS_FILE = path.join(__dirname, '/../users.json');

const handleLogin = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    // Read the existing users from the JSON file
    fs.readFile(USERS_FILE, 'utf8', async (err, data) => {
        if (err) {
            //console.error(err);
            return res.status(500).send('Internal server error');
        }

        const users = JSON.parse(data);

        // Find the user by username
        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(400).send('Invalid username or password');
        }

        // Check the password
        const isPasswordValid = await checkPassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send('Invalid username or password');
        }

        // Set a cookie (in a real-world scenario, this should be a secure token)
        res.cookie('username', username, { httpOnly: false, secure: false, maxAge: 3600000 }); // 1 hour expiration for demonstration
        res.status(200).send('Login successful');
    });
};

module.exports = handleLogin;

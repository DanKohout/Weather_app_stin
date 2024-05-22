const fs = require('fs');
const path = require('path');
const USERS_FILE = path.join(__dirname, '/../users.json');

const getFavoritePlace = (req, res) => {
    const { username } = req.query;

    if (!username) {
        console.log(req.query)
        return res.status(400).send('Username is required');
    }

    // Read the existing users from the JSON file
    fs.readFile(USERS_FILE, 'utf8', (err, data) => {
        if (err) {
            //console.error(err);
            return res.status(500).send('Internal server error');
        }

        const users = JSON.parse(data);

        // Find the user by username
        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(400).send('User not found');
        }

        // Check if the user has a favorite_place
        const favoritePlace = user.favorite_place || '';

        res.status(200).json({ location: favoritePlace });
    });
};

const setFavoritePlace = (req, res) => {
    const { username, favoritePlace } = req.query;

    if (!username || !favoritePlace) {
        return res.status(400).send('Username and favorite place are required');
    }

    // Read the existing users from the JSON file
    fs.readFile(USERS_FILE, 'utf8', (err, data) => {
        if (err) {
            //console.error(err);
            return res.status(500).send('Internal server error');
        }

        const users = JSON.parse(data);

        // Find the user by username
        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(400).send('User not found');
        }

        // Update the user's favorite_place
        user.favorite_place = favoritePlace;

        // Write the updated users back to the JSON file
        fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8', err => {
            if (err) {
                //console.error(err);
                return res.status(500).send('Internal server error');
            }

            res.status(200).send('Favorite place updated successfully');
        });
    });
};

module.exports = { getFavoritePlace, setFavoritePlace };

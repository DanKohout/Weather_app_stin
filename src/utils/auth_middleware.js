// authMiddleware.js
const authMiddleware = (req, res, next) => {
    const { username } = req.cookies;

    // Check if the username cookie exists
    if (!username) {
        //redirect to custom 401 page
        return res.status(401).render('401', {
            title: '401',
            name: 'Dakoh Kodah',
            errorMessage: 'Unauthorized'
        });
        //return res.status(401).send('Unauthorized');
    }

    // You might want to perform additional checks here, such as verifying the cookie against a session store

    next();
};

module.exports = authMiddleware;
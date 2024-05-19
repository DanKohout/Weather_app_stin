
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

const hashPassword = async (password) => {
    console.log(password);
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    console.log(bcrypt.hash(password, salt));
    return bcrypt.hash(password, salt);
};

const checkPassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};

module.exports = {
    hashPassword,
    checkPassword
};
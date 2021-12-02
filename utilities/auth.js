const jwt = require('jsonwebtoken');

module.exports = ({ req }) => {
    const token = req.headers.authorization || ''
    try {
        if (!token) {
            // eslint-disable-next-line no-param-reassign
            req = false;
        }
            let decodedToken;
            // eslint-disable-next-line prefer-const
            decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            return decodedToken;
        } catch (err) {
        return false;
    }
};

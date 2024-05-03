const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.TOKEN_KEY;

const checkAdminRole = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ err: 'Unauthorized' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ err: 'Unauthorized' });
        }
        if (decoded.role !== 'admin' || decoded.role !== 'manager') {
            return res.status(403).json({ err: 'Forbidden - Admin or manager role required' });
        }
        next();
    });
};

module.exports = checkAdminRole;
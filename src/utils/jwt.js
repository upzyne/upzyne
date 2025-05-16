const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'upzyne_secret';

exports.generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};

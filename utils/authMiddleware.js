const jwt = require('jsonwebtoken');
const secretKey = process.env.secretKey;

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed! Token not found.');
    }
    jwt.verify(token, secretKey, function (err, decoded) {
      if (err) {
        return res.status(400).send({ message: 'Invalid token!' });
        // res.status(400).json({ error: err });
      } else {
        req.decoded = decoded;
        req.authenticated = true;
        next();
      }
    });
  } catch (err) {
    res.status(400).send('Invalid token!');
  }
};


const isAdminMiddleware = async (req, res, next) => {
  // const user = await User.findById(req.body.id);
  try {

    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error('Authentication failed!');
    }
    jwt.verify(token, secretKey, function (err, decoded) {
      if (err) {
        return res.status(400).send({ message: 'Invalid token!' });
        // res.status(400).json({ error: err });
      } else {
        // req.decoded = decoded;
        if (decoded?.role === "0") {
          req.authenticated = true;
          next();
        } else {
          res.status(404).json({ message: 'you have not access' });
        }
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { authMiddleware, isAdminMiddleware };
const JWT = require('jsonwebtoken');

const User = require('../database/models/User');
const {hashText, compareHash} = require('../utils/hashGenerators');

const config = require('../config/config');

const signUp = async ({
  firstName,
  lastName,
  userName,
  email,
  phoneNumber,
  password,

}) => {
  const userExists = await User.findOne({
    userName,
    email,
  }).lean();

  if (userExists) {
    return null;
  }

  const hashedPassword = await hashText(password);
  const newUser = new User({
    firstName,
    lastName,
    userName,
    email,
    phoneNumber,
    password: hashedPassword,
    role: 'user',
  });

  const savedUser = await newUser.save();

  return savedUser;
};

const signIn = async ({
  userName,
  password,
}) => {
  const user = await User.findOne({
    userName,
  }).lean();

  if (!user) {
    return null;
  }

  const passwordRight = await compareHash(password, user.password);

  if (!passwordRight) {
    return null;
  }

  return user;
};

const generateToken = (userId, userName) => {
  const payload = {
    id: userId,
    username: userName,
  };

  return JWT.sign(payload, config.app.secret, {
    expiresIn: '48h',
  });
};

module.exports = {
  signUp,
  signIn,
  generateToken,
};

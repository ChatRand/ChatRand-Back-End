const BlackListedToken = require('../database/models/BlackListedToken');
const User = require('../database/models/User');
const UserLogin = require('../database/models/UserLogin');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const {
  FORBIDDEN,
  UNAUTHORIZED,
  OK,
} = require('../helpers/constants/statusCodes');

const showUserLogins = async (req) => {
  const userDetail = await User.findOne({
    _id: req.user.id,
  });

  if (userDetail) {
    const userLogins = await UserLogin.find({
      userId: userDetail._id,
      tokenDeleted: false,
    });

    const current = false;

    const logins = [];

    userLogins.forEach(async (login) => {
      current = false;
      if (req.user.tokenId == login.tokenId) {
        current = true;
      }

      login.current = current;
      logins.push(login);
    });

    return logins;
  } else {
    return null;
  }
};

const createUserLogin = async (userInfo) => {
  const userLogin = new UserLogin({
    userId: userInfo.userId,
    tokenId: userInfo.tokenId,
    tokenSecret: userInfo.tokenSecret,
    ipAddress: userInfo.ipAddress,
    device: userInfo.device,
  });

  const savedUserLogin = await userLogin.save();

  return savedUserLogin;
};

const blackListAToken = async (token) => {
  BlackListedToken.findOne({
    token: token,
  }).then((found) => {
    if (found) {
      jwt.verify(token, config.app.secret, async (err, payload) => {
        const login = await UserLogin.findOne({
          userId: payload.id,
          tokenId: payload.tokenId,
        });

        login.loggedOut = true;
        login.tokenDeleted = true;
        await login.save();
      });

      return {
        success: false,
        code: UNAUTHORIZED,
      };
    } else {
      jwt.verify(token, config.app.secret, async (err, payload) => {
        if (err) {
          return {
            success: false,
            code: FORBIDDEN,
          };
        }

        if (payload) {
          const login = await UserLogin.findOne({
            userId: payload.id,
            tokenId: payload.tokenId,
          });

          if (token.tokenDeleted) {
            login.loggedOut = true;
            await login.save();

            await BlackListedToken.create({
              token: token,
            });
          } else {
            login.loggedOut = true;
            login.tokenDeleted = true;
            await login.save();

            await BlackListedToken.create({
              token: token,
            });
          }
        }

        return {
          success: true,
          code: OK,
        };
      });
    }
  });
};

module.exports = {
  showUserLogins,
  createUserLogin,
  blackListAToken,
};

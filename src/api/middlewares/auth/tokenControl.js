/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const {
  UNAUTHORIZED,
  FORBIDDEN,
} = require('../../../helpers/constants/statusCodes');

const authenticateToken = async (
    expressParams,
    prisma,
    {
      sendErrorResponse,
    },
) => {
  const authHeader = expressParams.req.headers['authorization'];

  const bearer = authHeader && authHeader.split(' ')[0];

  if (bearer != 'Bearer') {
    return sendErrorResponse(
        UNAUTHORIZED,
        'Auth token required');
  }

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return sendErrorResponse(UNAUTHORIZED, 'Auth token required');
  }

  const tokenBlackListed = await prisma.blackListedToken.findFirst({
    where: {
      token: token,
    },
  });

  if (tokenBlackListed) {
    return sendErrorResponse(UNAUTHORIZED,
        'Token blacklisted. Cannot use this token');
  }
  console.log('env', process.env.DEV_APP_SECRET);
  jwt.verify(token, process.env.DEV_APP_SECRET, async (err, payload) => {
    if (err) {
      return sendErrorResponse(FORBIDDEN, 'Unable to verify the token.');
    }

    if (payload) {
      const login = await prisma.userLogin.findFirst({
        where: {
          user_id: payload.id,
          token_id: payload.tokenId,
        },
      });

      if (login.tokenDeleted) {
        const newBlackListedToken = await prisma.blackListedToken.create({
          data: {
            token: token,
          },
        });

        // eslint-disable-next-line max-len
        return sendErrorResponse(FORBIDDEN, 'Token deleted. Cannot use this token');
      }
    }

    expressParams.req.user = payload;

    return expressParams.next();
  });
};

module.exports = {
  authenticateToken,
};

const httpStatus = require('http-status');
const User = require('../models/user.model');
const moment = require('moment-timezone');
const { jwtExpirationInterval } = require('../../config/vars');


/**
 * Create new user
 * @public
 */
exports.create = async (req, res, next) => {
    try {
      const user = new User(req.body);
      const savedUser = await user.save();
      res.status(httpStatus.CREATED);
      res.json(savedUser.transform());
    } catch (error) {
      return next(User.checkDuplicateEmail(error));
    }
  };

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(accessToken) {
  const tokenType = 'Bearer';
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');

  return {
    tokenType,
    accessToken,
    expiresIn,
  };
}

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
    try {
      const { user, accessToken } = await User.findAndGenerateToken(req.body);
      const token = generateTokenResponse(accessToken);
      const userTransformed = user.transform();
      return res.json({ token, user: userTransformed });
    } catch (error) {
      return next(error);
    }
  };
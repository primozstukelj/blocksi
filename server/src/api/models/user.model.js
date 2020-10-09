const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const httpStatus = require("http-status");
const jwt = require("jwt-simple");
const moment = require("moment-timezone");
const APIError = require("../utils/APIError");
const { jwtSecret, jwtExpirationInterval } = require("../../config/vars");

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Before saving user to db, encrypt password
 */
userSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();

    const hash = await bcrypt.hash(this.password, 1);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
userSchema.method({
  transform() {
    const transformed = {};
    const fields = ["id", "firstName", "lastName", "email", "createdAt"];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  token(userId) {
    const playload = {
      exp: moment().add(jwtExpirationInterval, "minutes").unix(),
      iat: moment().unix(),
      sub: this._id,
      userId
    };
    return jwt.encode(playload, jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

/**
 * Get user
 *
 * @param {ObjectId} id - The objectId of user.
 * @returns {Promise<User, APIError>}
 */
userSchema.statics.get = async function (id) {
  try {
    let user;

    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await this.findById(id).exec();
    }
    if (user) {
      return user;
    }

    throw new APIError({
      message: "User does not exist",
      status: httpStatus.NOT_FOUND,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Find user by email and tries to generate a JWT token
 *
 * @param {ObjectId} id - The objectId of user.
 * @returns {Promise<User, APIError>}
 */
userSchema.statics.findAndGenerateToken = async function (options) {
  const { email, password, refreshObject } = options;

  if (!email)
    throw new APIError({ message: "An email is required to generate a token" });

  const user = await this.findOne({ email }).exec();

  const err = {
    status: httpStatus.UNAUTHORIZED,
    isPublic: true,
  };

  if (password) {
    if (user && (await user.passwordMatches(password))) {
      return { user, accessToken: user.token(user._id) };
    }
    err.message = "Incorrect email or password";
  } else if (refreshObject && refreshObject.userEmail === email) {
    if (moment(refreshObject.expires).isBefore()) {
      err.message = "Invalid refresh token.";
    } else {
      return { user, accessToken: user.token(user._id) };
    }
  } else {
    err.f = "Incorrect email or refreshToken";
  }
  throw new APIError(err);
};

/**
 * Check if a JWT token is valid
 *
 * @param {Object} token - The token.
 * @returns {Promise<User, APIError>}
 */
userSchema.statics.validateToken = async function (token) {
  try {
    const decoded = jwt.decode(token, secret);
    return { decoded };
  } catch (error) {
    return new APIError({
      message: "Token is not valid.",
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    });
  }
};

/**
 * Return new validation error
 * if error is a mongoose duplicate key error
 *
 * @param {Error} error
 * @returns {Error|APIError}
 */
userSchema.statics.checkDuplicateEmail = function (error) {
  if (error.name === 'MongoError' && error.code === 11000) {
    return new APIError({
      message: 'Validation Error',
      errors: [{
        field: 'email',
        location: 'body',
        messages: ['"email" already exists'],
      }],
      status: httpStatus.CONFLICT,
      isPublic: true,
      stack: error.stack,
    });
  }
  return error;
};
/**
 * @typedef User
 */
module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");
const { omitBy, isNil } = require("lodash");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");

/**
 * Contact Schema
 * @private
 */
const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Before saving user to db, convert userId property to BSON object
 */
contactSchema.pre("save", async function save(next) {
  try {
    this.userId = mongoose.Types.ObjectId(this.userId);

    return next();
  } catch (error) {
    return next(error);
  }
});

/**
 * Methods
 */
contactSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      "id",
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "createdAt",
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */

/**
 * Get contact
 *
 * @param {ObjectId} id - The objectId of contact.
 * @returns {Promise<User, APIError>}
 */
contactSchema.statics.get = async function (userId, id) {
  try {
    userId = mongoose.Types.ObjectId(userId);
    _id = mongoose.Types.ObjectId(id);

    const contact = await this.findOne({_id, userId}).exec();

    if (contact) {
      return contact;
    }

    throw new APIError({
      message: 'Contact does not exist',
      status: httpStatus.NOT_FOUND,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Update contact
 *
 * @param {ObjectId} id - The objectId of contact.
 * @returns {Promise<User, APIError>}
 */
contactSchema.statics.update = async function (
  userId, id,
  { firstName, lastName, email, phoneNumber }
) {
  try {
    userId = mongoose.Types.ObjectId(userId);
    _id = mongoose.Types.ObjectId(id);

    const contact = await this.updateOne(
      {_id, userId},
      { $set: { firstName, lastName, email, phoneNumber } }
    ).exec();
    
    if (contact.nModified) {
      return contact;
    }

    throw new APIError({
      message: "Contact does not exist",
      status: httpStatus.NOT_FOUND,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete contact
 *
 * @param {ObjectId} id - The objectId of contact.
 * @returns {Promise<User, APIError>}
 */
contactSchema.statics.delete = async function (userId, id) {
  try {
    _id = mongoose.Types.ObjectId(id);
    userId = mongoose.Types.ObjectId(userId);

    const contact = await this.deleteOne({_id, userId}).exec();
    
    if (contact.deletedCount) {
      return contact;
    }

    throw new APIError({
      message: "Contact does not exist",
      status: httpStatus.NOT_FOUND,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * List users in descending order of 'createdAt' timestamp.
 *
 * @returns {Promise<User[]>}
 */
contactSchema.statics.list = function (userId) {
  userId = mongoose.Types.ObjectId(userId);
  const options = omitBy({ userId }, isNil);

  return this.find(options).sort({ createdAt: -1 }).exec();
};

/**
 * @typedef Contact
 */
module.exports = mongoose.model("Contact", contactSchema);

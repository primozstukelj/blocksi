const httpStatus = require("http-status");
const Contact = require("../models/contact.model");
const APIError = require("../utils/APIError");

/**
 * Create new contact
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    req.body.userId = req.user.userId
    const contact = new Contact(req.body);
    const savedContact = await contact.save();

    res.status(httpStatus.CREATED);
    res.json(savedContact.transform());
  } catch (error) {
    return next(error)
  }
};

/**
 * Get all contacts
 * @public
 */
exports.all = async (req, res, next) => {
  try {
    const list = await Contact.list(req.user.userId);

    res.json(list);
  } catch (error) {
    return next(error);
  }
};

/**
 * Get contact
 * @public
 */
exports.one = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await Contact.get(req.user.userId, id);    
    
    res.json(contact.transform());
  } catch (error) {
    return next(error)
  }
};

/**
 * Update contact
 * @public
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.update(req.user.userId, id, req.body);

    res.json(contact.ok);
  } catch (error) {
    return next(error);
  }
};

/**
 * Delete contact
 * @public
 */
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.delete(req.user.userId, id);

    res.json(contact.ok);
  } catch (error) {
    return next(error);
  }
};

const express = require('express');
const jwt = require('express-jwt');
const userController = require('./controllers/user.controller');
const contactController = require('./controllers/contact.controller');
const { jwtSecret } = require('../config/vars');

const contactRoutes = express.Router();
contactRoutes.get('/:id',jwt({ secret: jwtSecret, algorithms: ['HS256'] }), contactController.one);
contactRoutes.get('/',jwt({ secret: jwtSecret, algorithms: ['HS256'] }), contactController.all);
contactRoutes.post('/',jwt({ secret: jwtSecret, algorithms: ['HS256'] }), contactController.create)
contactRoutes.put('/:id',jwt({ secret: jwtSecret, algorithms: ['HS256'] }), contactController.update);
contactRoutes.delete('/:id',jwt({ secret: jwtSecret, algorithms: ['HS256'] }), contactController.delete);

// Define modular router
const router = express.Router();
router.get('/', (req, res) => {
  res.send('index page');
});
router.post('/login', userController.login);
router.post('/register', userController.create);
router.use('/contacts', contactRoutes);

module.exports = router;

const express = require('express');
const userController = require('./controllers/user.controller');
const contactController = require('./controllers/contact.controller');

/*const contactRoutes = express.Router();
contactRoutes.get('/', contactController.all);
contactRoutes.get('/:id', contactController.one);
contactRoutes.put('/:id', contactController.update);
contactRoutes.delete('/:id', contactController.delete);*/

// Define modular router
const router = express.Router();
router.get('/', (req, res) => {
  res.send('index page');
});
router.post('/login', userController.login);
router.post('/register', userController.create);
// router.use('/contacts', contactRoutes);

module.exports = router;

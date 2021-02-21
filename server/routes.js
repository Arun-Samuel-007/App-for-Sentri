const express = require('express');
const router = express.Router();

const userController = require('./usercontroller');

router.post('/login', userController.login);

router.get('/loggedin', userController.getLoggedinUser);

router.get('/all', userController.getAllUsers);

router.post('/create', userController.createUser);

router.get('/:userId',userController.getSpecificUser);

router.patch('/:userId', userController.editUser)

module.exports = router;
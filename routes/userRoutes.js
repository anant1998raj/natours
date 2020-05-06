 const express = require('express');
 const userController = require('./../controllers/userController');
//  importing authController.js
const authController = require('./../controllers/authController');
///consept of creating and mountaining multiple routers
// step1:-create o9ne parent router for each of the resources tours and users....
//step3- crfeating a ne router which connect with the application   also known as sub application. and make in last of routes..
//step 2:- change it app.route to the tourRouter.route  for tours and userRouter.route for users..
const router = express.Router();


//creating routes for signup..for user user need to post onlty  during signup,login and passwordreset
router.post('/signup', authController.signup);
//creating routes for login..for user user need to post onlty  during signup,login and passwordreset
router.post('/login',authController.login);
////creating routes for  forgotPassword 
router.post('/forgotPassword', authController.forgotPassword);
////creating routes for  resetPassword 
router.patch('/resetPassword/:token', authController.resetPassword);

//new routes for users:1
router.route('/')
.get(userController.getAllUsers)
.post(userController.createUsers);
//new routes for users:2
router.route('/:id')
.get(userController.getUser)
.patch(userController.updateUsers)
.delete(userController.deleteUsers);

module.exports = router;
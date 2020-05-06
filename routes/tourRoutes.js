const express = require('express');
//imorting tourController
 const tourController = require('./../controllers/tourController');
 //importing authController.js
const authController = require('./../controllers/authController');
//  structuring
 

// step1:-create o9ne parent router for each of the resources tours and users....
//step3- crfeating a ne router which connect with the application   also known as sub application. and make in last of routes..
//step 2:- change it app.route to the tourRouter.route  for tours and userRouter.route for users..
const router = express.Router();

// task:1 create a checkBody middleware
// task:2 check if body contsins the name and the price property
// task:3 if not, send 400(bad request)
// task:4 add it ot the post handler stack
//this id for top-5 cheap tours
// we are also using middelware here for the filter output that a user actuallu need(using alias,,(tourController.aliasTopTours))
router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours);

// creating routes for aggregation pipeline
// router.route('/tour-stats').get(tourController.getTourStats);
// creating routes for plan your day(aggregte pipeline)
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan );

///using chainig concept here url is same /api/v1/tours  (making easy by chaining)
///mountaining step2 
router.route('/')
.get(authController.protect ,tourController.getAllTours)  
//chain middleware
.post(tourController.createTour);
///using chainig concept here url is same /api/v1/tours/:id
router.route('/:id')
.patch(tourController.updateTour)
.get(tourController.getTour)
//authorization for giving acess to only admin to delete
.delete(authController.protect,
    authController.restrictTo('admin','lead-guide',),
    tourController.deleteTour);
 
module.exports = router;

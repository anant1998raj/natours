const express = require('express');

const app = express();
const morgan =  require('morgan');
const AppError = require('./utils/appError');
// exporting errorcontroller.js
const globalErrorHandler  = require('./controllers/errorController');
 const tourRouter = require('./routes/tourRoutes')
 const userRouter = require('./routes/userRoutes')
// usig morgan middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// midddle-ware act betwenn req and res. ....this middle ware is used because Express doesnot post body data on the request...
app.use(express.json());
// serving  static files
app.use(express.static(`${__dirname}/starter/public`));



app.use((req,res,next )=>{
    console.log("hello from middleware 1");
    next();
    });

    app.use((req,res,next)=>{ 
        // for currwent time
        req.requestTime = new Date().toISOString();
        //acess the headers in express(authcontroller .protect)
        // console.log(req.headers);
        next();
    });

/* routes
app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);
*/
//step3 

//routes
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
//handling the unhandled routes
app.all('*',(req,res,next)=>{
//   res.status(400).json({
//       status:'fail',
//       message:`can't find ${req.originalUrl}on this server`
// });

//creating an error for check global error handler
// const err = new Error(`can't find ${req.originalUrl}on this server`);
//  err.status = 'fail';
//  err.statusCode = 404;
 next(new AppError(`can't find ${req.originalUrl}on this server`,404));
});

// global error handler 4 arguments means error -express ubderstand
app.use(globalErrorHandler);

module.exports = app;
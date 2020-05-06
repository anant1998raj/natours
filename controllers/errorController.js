//importing aaError.js
const AppError = require('./../utils/appError');
//for handleCastErrorDB invalid id
const handleCastErrorDB = err =>{
    // here path = _id (the field for which error created) and value = id nmumer(which is invalid in the case)
    const message = `Invalid ${err.path}: ${err.value}.`;
    // returning error message along with status
    return new AppError(message,400);
};
// for duplicate fields 
const handleDuplicateFieldsDB = err =>{  
    // here errmsg(mongoose the property as which error occrs) using reg.exp. for match text between quotes [0] is the first array
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    console.log(value);
    const message = `Duplicate Field value : ${value}.Please use another value!`;
    return new AppError(message, 400);
};
// handle validator error
const handleValidatorErrorDB = err =>{
// in order to extract all string in one  an aaray .....for all  different field like name ,duration.by (maping -loop)
const errors= Object.values(err.errors).map(el => el.message);
    const message =`Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400)
}
//for jwt error JsonWebTokenError(production)..invalid token
const handleJWTError = () => new AppError('Invalid Token. Please Login again',401);

//for jwt error TokenexpiredError(production)..expired token
const handleJWTExpiredError = () => new AppError('Your token expired .Please Login again',401);

// for Development 
const sendErrorDev = (err,res)=>{
    res.status(err.statusCode).json({  
        status:err.status,
        error:err,
        message:err.message,
        stack :err.stack
    });
}
//for production
const sendErrorProd =(err,res) =>{
    // operational ,trusted error: send message to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        });
        // programming or ther unknown error : don't leak error details to client
    } else{
// 1:-log error
console.error('ERROR',err);
//2:- send generic message
res.status(500).json({
    status:'error',
    message:'Something went very wrong!'
})
}
    
  
}



module.exports= (err,req,res,next)=>{
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'err';
    //development and production and error with more infromation
    if(process.env.NODE_ENV === 'development'){
            sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production'){
        // destructuring the original error
        let error ={...err};
        //getting name=CastError from mongoose invalid id
        if(error.name === 'CastError') error = handleCastErrorDB(error);
        //getting code =11000 from mongoose duplicate 
        if(error.code === 11000) error = handleDuplicateFieldsDB(error);
        // getting name=valodation error from mongoose validator
        if(error.name === 'ValidationError') error = handleValidatorErrorDB(error);
        // getting name ===JsonWebTokenError from mongoose(production) //token....invalid token
        if(error.name === 'JsonWebTokenError') error = handleJWTError(error);
        // getting name ===TokenExpiredError from mongoose(production) //token....expired token
        if(error.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
            sendErrorProd(error,res);
    }
};
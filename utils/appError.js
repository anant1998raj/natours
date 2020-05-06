// global error handler 4 arguments means error -express ubderstand
class AppError extends Error {
    constructor(message, statusCode){
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        //this:-current object, this.constructor:-app.erroe class
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
const mongoose = require('mongoose');
const dotenv = require('dotenv');

///uncaught exception  //it should be in top so it can handle the uncaught exception
process.on('uncaughtException',  err =>{
    console.log(err.name, err.message);
    console.log('UNCAUGHT EXCEPTION!! application shuting down');
        process.exit(1);
});
dotenv.config({ path: './config.env' });


// note application must be after env.variableee...
const app = require('./app');


// importing

/*  
// enviroment variable that is global variable
console.log(app.get('env'));
*/

// nodejs bunch of envirnoment variable (),we dont have to require process module
// console.log(process.env); 

// replacing db password from the host link
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD); 

// mongoose variable connect method..
// for remote (host)
mongoose.connect(DB, {
    // if we need fro local comment out [.connect(DB,{ ] and write[.connect(process.env.DATABASE_LOCAL,{ ]
    // .connect(process.env.DATABASE_LOCAL,{
    // deprecation warnings...
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    //returns a promise..the promiss herer get acess to connectinon object.........con will  reserved value of the promise
    .then(() => console.log('DB connection succesfull')); 
const port = process.env.PORT || 3000;
const server =app.listen(port, ()=>{
console.log(`App working on port ${port}...`);
});

//handling the unhandled exception or rejected promise

//using of event /event listner ,process object emit and pbject and call unhandeled rejection
process.on('unhandledRejection',  err =>{
    console.log(err.name, err.message);
    console.log('UNHAN DELED REJECTION!! application shuting down')
    //to shut dowm application smoothly..closing all server
    server.close(()=>{
//forcely closing application..process.exit(1)=unhandled exception   and process.exit(0)=success
process.exit(1);
    });
});


    // console.log(x);//eg of uncaught exception
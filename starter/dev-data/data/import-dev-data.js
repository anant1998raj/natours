// this is to import json .......hence we need filesystem
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../../models/tourModel')

dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => console.log('DB connection succesfull'));

// read json file
const tours = JSON.parse
(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));
// import data into db
const importData = async () => {
    try {
        // create method can simply accept a array of objetc and it create documents for each of  the obejcts...
        await Tour.create(tours);
        console.log('Data Succcessfully loaded!!!!!!!!!!!');
    } catch (err) {
        console.log(err);
    }
    // aggresive way to stopping application
    process.exit();
};
// delete all data from db
const deleteData = async () => {
    try{ 
        await Tour.deleteMany();
        console.log('Data Deleted Successfully');
     
    }catch (err){
        console.log(err);
    }
    // aggresive way to stopping application
    process.exit();
}; 
/*
// interacting with the commandline
*/


// condition for import and delete
if (process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
}


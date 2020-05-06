const mongoose = require('mongoose');
const slugify = require ('slugify');
// const validator = require('validator');

// creating schema 
const tourSchema = new mongoose.Schema({
    name: {
        // using schmea-type option for more than one options
        type: String,
        // for both required:true and error message we are using array[]
        required: [true, 'A tour must have a name'],
        // evry tour with unique name
        unique: true,
        trim:true,
        // validators
        maxlength:[40, 'A tour must have less than or equal to 40 characters'],
        minlength:[10, 'A tour must have more than or equal to 10 characters'],
        // using npm validator for name  Tour must be in character along with message(space in ane not allowed)
        // validate: [validator.isAlpha,'Tour name must be in character']
    },
    slug:String,
    duration:{
       type:Number,
       required:[true, 'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,'A tour must have a group size']
    },
    difficulty:{
        type:String,
        required:[true,'A tour must have difficulty'],
        enum:{
            values: ['easy','medium','difficult'],
            message:'Difficulty be either easy medium and hard'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'minimun rating 1'],
        max: [5, 'maximum rating 5']
    },   
    ratingsQuantity: {
        type:Number,
        default:0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount :{
type:Number,
// validate along with message({VALUE})
validate:{
    validator:function(val){
        // this only points to current doc...not to new doc(not applicable fro update)
        return val < this.price;//100<200
    },
    message: 'Discount price ({VALUE}) should be lower than regular price',
}
    } ,   
    summary:{
        type:String,
        // trimm is use to clear out empty spaces.....
        trim:true,
        required:[true, 'A tour must have a discription']
    },
    discription:{
        type:String,
        trim:true
    },
    // here we are  having name of the image which we will later be ahve from the image system(or we can say just brefrence of the image(instead of stoiring entire picture on the database we are just using the refrence name....))
    imageCover:{
        type:String,
        required:[true, ' A tour must have cover image']
    },
    // we ha ve multiple images so save it as an array o0f string...
    images:[String],
    createdAt:{
        type: Date,
        default: Date.now(),
        select:false
    },
    startDates:[Date],
    secretTour:{
        type:Boolean,
        default:false
    }
},{
    toJSON:{ virtuals :true},
    toObject:{ virtuals :true} 
});

// virtual properties  name of virtual properties   (durationWeeks)
tourSchema.virtual('durationWeeks').get(function(){
    // for the days in a week
 return this.duration/7;
});

///////////////code not working////////////////////////////
// creating a model
// const variable(capital T) = mongoose.model('modelname(capital T)',schmea)
const Tour = mongoose.model('Tour', tourSchema);
//mongoose middleware PRE DOCUMENT MIDDLEWARER :runs before .save() and .create()..not run with insert many()
tourSchema.pre('save',function(next) {
    // here this :-- currently processed document...
    //slug not working
    this.slug= slugify(this.name,{lower:true});
    next();
});

tourSchema.pre('save',function(next){
    console.log('save docment success');
    next();
});
// post middle ware works after pre()
tourSchema.post('save',function(doc, next){
    console.log(doc);
    next();
})
////////////////////////////
///////query middelware  using of /^find/ for all type of find

// tourSchema.pre('find',function(next){
    tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}});
    //for time
    this.start = Date.now();
    next();
})
//post() query
tourSchema.post(/^find/,function(docs,next){
    //for time taken(current time-start time)
    console.log(`Qurey took${Date.now()- this.start} milliseconds`);
    console.log(docs);
    next();
})
////////////aggregatoin middelware
tourSchema.pre('aggregate',function(next){
    //inoreder to filter out the secret tours alll we have to do another match stats right at the begining of the pipeine array() using unshit() for begining...
    this.pipleline().unshift({ $match:{ $ne:ture}}); 
    console.log(this.pipeline());
next()
});
// exporting Tour
module.exports = Tour;  













/////////////////////////////////////
/*
// crerating document on model
const testTour= new Tour({
    name:'The Park Camper',
    // rating:'4.7',
    price:997
    });
    // saving document with return promise and() error check 
    testTour.save()
    .then(doc =>{
        console.log(doc);
    })
    .catch(err =>{
        console.log('ERROR :',err);
    });

    */
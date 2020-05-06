// importiong Tour from tourModel.js
const Tour = require("./../models/tourModel");

//importing apiFeatures.js
const APIFeatures = require("./../utils/apiFeatures");

// importing catchAsync.js(getting rid of all try and catch)
const catchAsync = require('./../utils/catchAsync');

//importing appError.js for global error handler
const AppError = require('./../utils/appError');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage";
  next();
};

// /////routes handelers for tours starts
/////////////////////// GET (reading documents)
exports.getAllTours = catchAsync(async (req, res ,next ) => {
    /*     
             ////////////////////////////////////// before the class concept/////////////////////////////////////////////////////////////////////////////
      ////////////// 1-a  filtering         //////////build the query
             // deleting elements from the query(... is excluding) also hard copy
             const queryObj ={...req.query};
             const excludedFields = ['page','sort','limit','fields'];
             // using for.Each loop for the deletion of page then sort then limit then field
             excludedFields.forEach(el => delete queryObj[el]);
             //////////////////////////////////////////////////////////////////
             // req.query(request data on req ,in query as a field)
             // req.query:-it gives us the object nicely formatted with data from query string
             // console.log(req.query, queryObj); 
             //////////////////////////////////////////////////////////////////
     
             // const query = Tour.find(queryObj); for tyhe noraml filter
             
      
            //// 1-b   ADVANCE FILTERING/////////////////////////////////////
     
            // The JSON. stringif y() method converts a JavaScript object or value to a JSON string
             let queryStr = JSON.stringify(queryObj); 
             //replacing(adding $ before the operator) through the regular expression....
             queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
             // again coverting it ...
             // console.log(JSON.parse(queryStr)); test
             // for advance filter 
              let query = Tour.find(JSON.parse(queryStr)); 
             // console.log(req.url); checking url request
      ////////////////// 2 sorting //////////////////////////////
      if(req.query.sort){
         //  we are using the split by comma, and jion by  space(' ') in case of multiple sort
          const SortBy = req.query.sort.split(',').join(' ');
          query = query.sort(SortBy);
      }     
      else{
         //  sorting on the basis of created first...
          query = query.sort('-createdAt');
      }
     
      ////////////////// 3 field  LIMITING /////////////////////////////////////////////////////////////////////////////////////////
     if(req.query.fields){
         const fields = req.query.fields.split(',').join(' ');
          query = query.select(fields);
     }else{
      query = query.select('-__v');
     }
     
     ///////////////4 pagination
     //herer *1 is used to convert it into numebr and ||1 is the default value we are providing and the same for the limit field
     const page = req.query.page*1 || 1;
     const limit = req.query.limit*1 || 100;
     // (no. of page -1)*limits(val) = the number of documents we wants to skip
     const skip =(page-1)*limit;
     //working of query for the  pagination
      query = query.skip(skip).limit(limit);
     
     //  if the numer of entered page by the user is more than it exists thenn
     
     if (req.query.page){
         const numTours = await Tour.countDocuments();
         if(skip>= numTours) throw new Error('this page dose not exist');
     }
     */
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*
        // find () read document 
        // using  basic filter method
        const query =  Tour.find({
            duration: 5,
            difficulty:'easy'
        }); */
    ////////////// Execute The Query
    // const tours = await query ; before the usee of classs only
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    //query.sort().select().skip().limit()
    // we can also write
    //  const tours = await Tour.find(req.query);
    /*
        // using mongoose special method(chaining)
        const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy');
        */
    //   /// ////////////send response
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
});
/////////////////////////////// find get-tour
////// search url with  a vriables....thses variables can be single or can be multiple.....and aslo it can be optiional bye using?
///////////// ,app.get('/api/v1/tours/:id/x?')example of variables ////
exports.getTour =catchAsync (async (req, res, next) => {
    // Tours.findOne({_id: req.params.id})
    const tour = await Tour.findById(req.params.id);
    // for 404 eror if tour=null
   if(!tour){
     return next( new AppError('No tour found for given id',404));
   }
    res.status(200).json({
      status: "Success",
      data: {
        tour,
      },
    });
});

/////////////////////////post///////////////////////////////////////////making it async await........////////////////////////////

//getting rid of try and catch full explanation is in copy
//modificaition in code accroding to catchasync////6th video
exports.createTour = catchAsync (async (req, res, next) => {
  const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  });

  /*
  ////getting rid of try catch start...
  try {
    // creating documents...
    // here the mehtod is called on the newTour
    // const newTour = new Tour({})
    // newTour.save()

////    new simple wayy(The method directly call on the tour..) here using async await...req.body(post)   ///////////////////
  
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
////getting rid of try catch ends.....
*/

///////////////update(patch) starts/////////////
exports.updateTour = catchAsync (async (req, res, next) => {
  
    //  update :- first find id(req.params.id) and themn upadte from req.body and then new : true (new updated document in order to return), and runValidators:(for validation)
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if(!tour){
      return next( new AppError('No tour found for given id',404));
    }
    res.status(200).json({
      status: "Success",
      data: {
        tour: tour,
      },
    });
    });
/////////////////delete starts/////////////
exports.deleteTour = catchAsync (async (req, res, next) => {
  
    // delete by id
 const tour =  await Tour.findByIdAndDelete(req.params.id);

    if(!tour){
      return next( new AppError('No tour found for given id',404));
    }
    res.status(204).json({
      status: "success",
      message: "Id deleted succesfully",
      data: null,
    });
});
///code not working!!!!!!!!!!!!!!!!!!!!!starts
///route handels for agreegate pipeline
exports.getTourStats = catchAsync (async (req, res, next) => {

    const stats =await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // _id: null,
          id:{ $toUpper:'$difficulty'},
          numTours:  { $sum:1 },
          numRatings:{ $sum: '$ratingsQuantity'},
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice:  {  $avg: "$price" },
          minPrice:  {  $min: "$price" },
          maxPrice:  {  $max: "$price" }
        }
      },
      // using sort on the basis of avgprice  1 is used for ascending order
      {
        $sort: {avgPrice:1},
      },
      {
        // using another stats with new operator $ne(not equal to)..here id ios based on stats id (difficluty)
        $match :{ _id:{ $ne: 'EASY'}}
      }
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
});
//////////////////////////////////////code not working end//////////////////
///route handler for aggregate pipeline for tours per month
exports.getMonthlyPlan = catchAsync (async (req, res, next)=>{

// for years we are getting :year params and then *1 convert it to numbers
const year = req.params.year *1;//2021
const plan = await Tour.aggregate([
  {
    //unwwind :-used to distruct array and give one document for each  elemnt as output.
  $unwind : '$startDates'
},
// for year start date (2020-01-01) to(2020-31-12)
{
  $match :{
    startDates:{
      // format year date month
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31`)    
    }
  }
},
// grouping(name and tyhe number of tour per month  using &month)
{
  $group:{
    // number of tours per month (month is between 1-12)
_id:{$month: '$startDates'},
numTourStarts: {$sum : 1},
// name of the tours in array it might be moire than  one tour fro the same month
tours: {$push:'$name'}
  }
},
{
  // adding fields with _id value in it
  $addFields:{ month :'$_id'}
}  ,
{
  // project fields 0= not show 1 = show
  $project:{_id: 0}
},
{
  // sorting by numers of touyr in decnding order -1
  $sort:{numTourStarts:-1}
}
]);
   res.status(200).json({
     status: 'success',
     data:{
       plan
     }
   });
});


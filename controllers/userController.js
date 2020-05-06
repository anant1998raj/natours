const User = require("./../models/userModel");
const catchAsync = require('./../utils/catchAsync');



/ /////routes handelers for users starts
exports.getAllUsers=catchAsync(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        results: users.length,
        data: {
          users,
        },
      });
});


exports.getUser=(req,res)=>{
    res.status(500).json({
status: "fail",
message:"not found"
    });
}

exports.createUsers=(req,res)=>{
    res.status(500).json({
status: "fail",
message:"not found"
    });
}

exports.updateUsers=(req,res)=>{
    res.status(500).json({
status: "fail",
message:"not found"
    });
}

exports.deleteUsers=(req,res)=>{
    res.status(500).json({
status: "fail",
message:"not found"
    });
}
const crypto = require('crypto');
//importing promisify the oject of util using es6 (utils//{promisify})
const {promisify} = require('util');
const User =  require('./../models/userModel');
// importing catchAsync.js(getting rid of all try and catch)
const catchAsync = require('./../utils/catchAsync');
//for jsonwebtoken  
const jwt = require('jsonwebtoken');
// importing global apperror
const AppError = require('./../utils/appError');
// importing global email.js
const sendEmail = require('./../utils/email');


//creating a function for token wich only recv id..and from es6 (id=id)==={id}
//..(jwt=header(auto)+payload+secret)

const signToken = id =>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN
});    
};

exports.signup = catchAsync (async (req,res)=>{
    // modelname.create(this will allow user to add another row(like photo,conatct etc) in body as  a admin so this code is reolaced by.the the new code in final lecture...)
    const newUser = await User.create(req.body);
    /* REPLACE CODE (NEW CODE))
    //new code for security of the (REPLACE):-final upadte code but in the bootcamp tutorial old code is applicable..........
    const newUser = await User.create({
        name:- req.body.name,
        email:req.body.email,
        password:req.body.password, 
        passwordConfirm:req.body.passwordConfirm
    })
    */

    //login as soon as the user signup..(jwt=header(auto)+payload+secret)
    const token = signToken(newUser._id);
    //sending response 
    res.status(200).json({
        stauts:'success',
        token,
        data:{
            // envelop =user
            user: newUser,
        }
    })
});

//for login....
exports.login = catchAsync(async(req,res,next) =>{ 
  // const email = req.body.email;here both email =email so by the use of es6 the same code is writeen as  same as password
  const  {email,password} = req.body;

//   1:check if email and password exists
if(!email || !password){
 return next(new AppError('Please provide a email and password',400));
}
// 2: check if user exists && pasword is correct//explityt select password for match tha password 
const user = await User.findOne({ email }).select('+password');
// console.log(user)
  
//  ppppp const correct = await user.correctPassword(password, userPassword);...................//calling instance methods.correct
  //checking....suppose if user not exists then.....ppppp replace correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // If everything is fine then send the token to the user

  const token =signToken(user._id);
  res.status(200).json({ 
      stauts:'success',
      token,
  });
});

//for prtectin all tours
exports.protect= catchAsync(async(req,res,next)=>{
// 1 getting tokens and check of it's there
let token;
if(
  req.headers.authorization && 
  req.headers.authorization.startsWith('Bearer'))
  //split by sapce and gettignthe token as array after Bearer [1]
  {
token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);
  //cheking if token is there or not
  if(!token){
    return next(new AppError('You are not loged in kinldy log in and try again....unothorised',401));
  }
//2 varification token using inbuilt util obj:-{promisify}..also using jwt verify function 
  const decoded = await (jwt.verify)(token,process.env.JWT_SECRET);
  // console.log(decoded);
//3 check if user is avilable  copy
const currentUser = await User.findById(decoded.id);
if(!currentUser){
  return next (new AppError('The user belonging to this token not longer exist',401));
}
// 4 check if user password change after token(jwt)issued
//calling the instance method from usermodules  
//JWTTIMESTAMP -deocded.iat         (iat=issuedat)
if (currentUser.changesPasswordAfter(decoded.iat)){
  return next(new AppError('User recently changed password !! please login again..',401))
}
//grant acess to protect route
req.user=currentUser;
next();
});

//for authentication for special acees like admin lead-guide to delete something...
//(..roles) is a es6 rest.paramater syntax and it wil create an array of all the specified arguments
//(..roles) is also used because we dint pass argument in middlewarefunction..but for special acees fro adim and lead guide thius is required to pass argument ...
exports.restrictTo = (...roles)=>{
return (req, res,next)=>{
  //roles['admin','lead-guide']. role='user'
if(!roles.includes(req.user.role)){
  return next(new AppError('you are not allosed to acces this page #forbidden',403));
}
next();
} 
};

//for forgeting password and reset it
exports.forgotPassword = catchAsync(async (req,res,next)=>{
  //1) get user based on POSTed email
  const user = await User.findOne({email: req.body.email});
  //cheking for user for the given email
  if(!user){
    return next(new AppError('No user exit with the given email..#not found',404));
  }

  //2) Generate the random token 
const resetToken = user.createPasswordResetToken();
//validateBeforeSave:false this will off all the valida tors.......
//it only modigy the data  it doesnt save it 
await user.save({validateBeforeSave:false});

// 3) send it to the user's email
const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

const message = `Forgot your password ? Submit a PATCH request with your new password and passwordConfirm to:${resetURL}.\n If you didn't forgot your password please ignore this email!`;



// I have also learned that even if you declare a try..catch block for your async function, if it resolves before it is await-ted, then you will get an unhandled rejection, i.e............in the bootcamp tutorial we try{await sendEmail...but ..



try{
  sendEmail({
  email:user.email,
  subject:'your password reset token(valid only for 10 min)',
  message
});
res.status(200).json({
  stauts:'success',
  message:'Token sent to email!!'
});
} catch (err){
  user.passwordResetToken=undefined;
  user.passwordResetExpires=undefined;
  //it only modigy the data  it doesnt save it
   await user.save({validateBeforeSave:false});
  return next(new AppError('There ws an error sending the email.Try again!! #servreerror',500))
}
});

exports.resetPassword = (req,res,next) =>{}; 
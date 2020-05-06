//inbulit function crypto
const crypto = require('crypto');
const mongoose =  require('mongoose');
const validator = require('validator');
//importing bcrypt for encrypting password
const bcrypt = require('bcryptjs');
//creating schema
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,' user must have a name'],
        trim:true,
        maxlength :[20,'user Name must have not more than 20 characters'],
        minlength :[2,'user Name must have not less than 2 characters'],
    },
    email:{
        type:String,
        required:[true,'please enter a valid email'],
        unique:true,
        //   using npm validator for name  Tour must be in character along with message(space in ane not allowed)
        validate: [validator.isEmail,'please enter a valid email'],
        lowercase:true,
    },
    photo:{
        type:String,
        // required:[true,'user must have a photo ']
    },
role:{
type: String,
enum:['user','guide','lead-guide','admin'],
default:'user',
    },
    password:{
        type:String,
        required:[true,'please enter a password'],
        minlength:8,
        select:false,
    },
    passwordConfirm:{
        type:String,
        required:[true,'please confirm your password'],
        //validating paswword === passwordConfirm//creatin validator
        validate:{
            //this only works on create and save!!!
                validator: function(el){
                    //not using => because we need this.
                    return el === this.password; 
                },
                message:' OOPS!! Password are not same!!!'
        }
    },
    
    passwordchangedAt: {
            type:Date
        },
        passwordResetToken :{
            type:String
        },
        passwordResetExpires:{
            type:Date
        },
        
});
//encrytpig the password by use of bcryptjs
//encrption is done middle between create and save
userSchema.pre('save',async function(next){    
    //only run this function if password is actually modified
   if(!this.isModified('password'))return next();
    //hasing the password in cost of 12
    this.password =await bcrypt.hash(this.password,12);
    // delete passwordConfirm Field it was only for the validation purpose..
   this.passwordConfirm=undefined;
   next();
});

////for checking password === encryptedpassword
//1:-we will do it by creating INSTANCE METHOD which will avilable for   all documnet of certain collection
// 2:-candidatePassword=manual entered password by user,userPassword=encryptetd hash passsword
//3:-call it into authcontroller
userSchema.methods.correctPassword =async function(candidatePassword,userPassword,next){
return await bcrypt.compare(candidatePassword,userPassword);
};

//creating instance for check the password chnaged  by JWTTimestamp and passwordchangedAt property
userSchema.methods.changesPasswordAfter = function (JWTTimestamp){
//cheking if password is chnged or not by using the passwordchangedAt property
if(this.passwordchangedAt){
    // for compare time of  geting token and change_in_password convert in intezer and divide by 1000 and base of 10
    const chnagedTimestamp =parseInt(this.passwordchangedAt.getTime()/1000,10)
    console.log(changedTimestamp, JWTTimestamp);
    //conditon for true and false for password chnagetime and tokentime
    return JWTTimestamp < chnagedTimestamp;
}
//false means no chnage in password!
return false; 
};
//creating instance for forgot  password
userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    //saving reset token in 
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({resetToken}, this.passwordResetToken);  
    //expiring the token within( 10*60*1000)= 10 min.....
   this.passwordResetExpires = Date.now() + 10*60*1000;
   return resetToken;
}

// we want to call our userSchema User
const User = mongoose.model('User',userSchema);
module.exports = User;
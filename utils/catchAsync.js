//getting rid of try and catch full explanation is in copy
module.exports = fn =>{
    return (req,res,next)  =>{
      fn(req,res,next).catch(next);
    };
  };
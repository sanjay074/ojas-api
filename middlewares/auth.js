const jwt = require("jsonwebtoken");
const User = require("../User/models/user");
const verifyToken = (req, res, next) => {
    let authHeader = req.header("authorization");
    if (authHeader) {
      authHeader = authHeader.split(" ");
      const token = authHeader[1];
      if (!token) {
        return res
          .status(403)
          .json({status:0, message: "A token is required for authentication" });
      }
      try {
        const getuser = jwt.verify(token, process.env.JWT_SER);
        req.user = getuser;
        next();
      } catch (err) {
        return res.status(401).json({ status:0,message: "Token is not valid!" });
      }
    } else {
      return res
        .status(403)
        .json({status:0, message: "A token is required for authentication" });
    }
  };

  const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        return res.status(401).json({status:0 ,message:"You are not admin user"});
      }
    });
  };

  
  const verifyTokenAndUser = async (req, res, next) => {
    verifyToken(req,res,async()=>{
      const user = await User.findById(req.user.id);
      if(!user){
        return res.status(401).json({status:0,message:"You are not  unauthorized user"});
      }else{
        next();
      }
    })
  };

 module.exports={
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndUser
 } 
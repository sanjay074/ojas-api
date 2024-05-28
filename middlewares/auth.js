const jwt = require("jsonwebtoken");

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

 module.exports={
    verifyToken
 } 
const Coures = require("../models/coures");
const mongoose = require("mongoose")
const {addCouresSchema} = require("../../validators/authValidator");

exports.addCoures = async (req,res)=>{
    try{
     const {error} = addCouresSchema.validate(req.body);
     if(error){
        return res.status(400).json(error.details[0].message);
     }
     const {couresName,sellPrice,totalPrice,title,description,type} = req.body;
     const exist = await Coures.findOne({couresName});
     if(exist){
        return res.status(400).json({
            status:0,
            message:"This coures name is already taken!"
        })
     }
     const addCoures = new Coures({
        couresName,
        sellPrice,
        title,
        totalPrice,
        description,
        type
     })

     const saveData = await addCoures.save();
      return res.status(200).json({status:1, message:"New coures created  sucessfully"});
    }catch(error){
        return res.status(500).json({
            status:0,
            message:error.message.toString(),
        })
    }
}

exports.getAllCoures = async (req, res) => {
    try {
      const { page, limit } = req.query;
      const skip = (page - 1) * 10;
      const getAllCoures = await Coures.find().skip(skip).limit(limit);
      res.status(200).json({status:1, message: "Find all  coures list ", getAllCoures});
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString(),
      });
    }
  };

  exports.getOneCoures = async (req, res) => {
    try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
         return res.status(400).json({ status: 0, message: "Invalid course ID" });
        }  
      const getOneCoures = await Coures.findById(req.params.id);
      if(!getOneCoures){
        return res.status(400).json({status:0,message:"Course not found with this ID"})
      }
      res.status(200).json({status:1, message: "Find all  coures list ",getOneCoures});
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString(),
      });
    }
  };


  exports.deleteCoures = async (req, res) => {
    try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
         return res.status(400).json({ status: 0, message: "Invalid course ID" });
        }  
      const getOneCoures = await Coures.findByIdAndDelete(req.params.id);
      if(!getOneCoures){
        return res.status(400).json({status:0,message:"Course not found with this ID"})
      }
      res.status(200).json({status:1, message: "Couress delete sucessfully"});
    } catch (error) {
      return res.status(500).json({
        status: 0,
        message: error.toString(),
      });
    }
  };
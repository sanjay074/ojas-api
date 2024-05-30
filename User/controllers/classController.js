const Class = require('../models/class');
const mongoose = require('mongoose');
const {addClassSchema} = require('../../validators/authValidator');
exports.addClass = async (req,res)=>{
  try{
    const {error} = addClassSchema.validate(req.body);
    if(error){
        return res.status(400).json(error.details[0].message);
    }
    const {couresId,classNo,description,classyoutubelink,videoWatchTime} = req.body
    const exist = await Class.findOne({classNo});
    if(exist){
        return res.status(400).json({
            status:0,
            message:"This class number is already token!"
        })
    }
    const addClass = new Class ({
       couresId,classNo,description,classyoutubelink,videoWatchTime

    })
    const saveData = await addClass.save();
    return res.status(201).json({status:1, message:"New class  created  sucessfully"});

  }catch(error){
    return res.status(500).json({
        status:0,
        message:error.message.toString(),
    })
  }
}

exports.getAllClass = async(req,res)=>{
    try{
        const getAllClass = await Class.find().populate("couresId")
        if(!getAllClass){
            return res.status(400).json({
                status:0,
                message:"No any class"
            })
        }
        return res.status(201).json({status:1, message:"Get all class sucessfully",getAllClass}); 

    }catch(error){
        return res.status(500).json({
            status:0,
            message:error.message.toString(),
        })
    }

}

exports.updateClass = async (req,res)=>{
    try{
    const courseId = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(courseId)){
      return res.status(400).json({ status: 0, message: "Invalid course ID" });
    }
    const updateCoures = await Class.findByIdAndUpdate(courseId,{$set:req.body},{new:true});
    return res.status(200).json({
      status: 1,
      message: "Class data update successfully",
    });
    }catch(error){
       return res.status(500).json({
         status:0,
         message:error.toString(),
       })
    }
  }


  exports.geOneClass = async(req,res)=>{
    try{
        const classId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(classId)){
            return res.status(400).json({ status: 0, message: "Invalid course ID" });
          }
        const getAllClass = await Class.findById(classId).populate("couresId")
        if(!getAllClass){
            return res.status(400).json({
                status:0,
                message:"No any class"
            })
        }
        return res.status(201).json({status:1, message:"Get all class sucessfully",getAllClass}); 

    }catch(error){
        return res.status(500).json({
            status:0,
            message:error.message.toString(),
        })
    }

}
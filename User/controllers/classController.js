const Class = require('../models/class');
const mongoose = require('mongoose');
const {addClassSchema} = require('../../validators/authValidator');
exports.addClass = async (req,res)=>{
  try{
    const {error} = addClassSchema.validate(req.body);
    if(error){
        return res.status(400).json(error.details[0].message);
    }
    const {couresId,classNo,description,classyoutubelink,videoWatchTime,className} = req.body
    const exist = await Class.findOne({classNo});
    if(exist){
        return res.status(400).json({
            success:false,
            message:"This class number is already token!"
        })
    }
    const addClass = new Class ({
       couresId,classNo,description,classyoutubelink,videoWatchTime,className

    })
    const saveData = await addClass.save();
    return res.status(201).json({success:true, message:"New class  created  sucessfully"});

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
                success:false,
                message:"No any class"
            })
        }
        return res.status(201).json({success:true, message:"Get all class sucessfully",getAllClass}); 

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
      return res.status(400).json({success:false, message: "Invalid course ID" });
    }
    const updateCoures = await Class.findByIdAndUpdate(courseId,{$set:req.body},{new:true});
    return res.status(200).json({
      success:true,
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
            return res.status(400).json({ success:false, message: "Invalid course ID" });
          }
        const getAllClass = await Class.findById(classId).populate("couresId")
        if(!getAllClass){
            return res.status(400).json({
                success:false,
                message:"No any class"
            })
        }
        return res.status(201).json({success:true, message:"Get all class sucessfully",getAllClass}); 

    }catch(error){
        return res.status(500).json({
            status:0,
            message:error.message.toString(),
        })
    }

}
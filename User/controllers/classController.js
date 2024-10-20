const Class = require('../models/class');
const Coures = require("../models/coures");
const Purchase = require("../models/purchase");
const mongoose = require('mongoose');
const { addClassSchema } = require('../../validators/authValidator');
exports.addClass = async (req, res) => {
  try {
    const { error } = addClassSchema.validate(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }
    const { courseId, classNo, description, classyoutubelink, videoWatchTime, className,isDemo } = req.body
    const exist = await Class.findOne({ classNo, courseId });
    if (exist) {
      return res.status(400).json({
        success: false,
        message: "This class number is already taken for this course!"
      });
    }
    const addClass = new Class({
      courseId, classNo, description, classyoutubelink, videoWatchTime, className,isDemo

    })
    const saveData = await addClass.save();
    return res.status(201).json({ success: true, message: "New class  created  sucessfully" });

  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message.toString(),
    })
  }
}

exports.getAllClass = async (req, res) => {
  try {
    const getAllClass = await Class.find().populate("courseId")
    if (!getAllClass) {
      return res.status(400).json({
        success: false,
        message: "No any class"
      })
    }
    return res.status(201).json({ success: true, message: "Get all class sucessfully", getAllClass });

  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message.toString(),
    })
  }

}

exports.updateClass = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }
    const updateCoures = await Class.findByIdAndUpdate(courseId, { $set: req.body }, { new: true });
    return res.status(200).json({
      success: true,
      message: "Class data update successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.toString(),
    })
  }
}


exports.getOneClass = async (req, res) => {
  try {
    const classId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(classId)) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }
    const getAllClass = await Class.findById(classId).populate("courseId")
    if (!getAllClass) {
      return res.status(400).json({
        success: false,
        message: "No any class"
      })
    }
    return res.status(201).json({ success: true, message: "Get all class sucessfully", getAllClass });

  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: error.message.toString(),
    })
  }

}


// exports.getAllClassByCourseId = async (req, res) => {
//   try {
//     const { courseId } = req.params;
//     if (!mongoose.Types.ObjectId.isValid(courseId)) {
//       return res.status(400).json({ success: false, message: 'Invalid course ID format' });
//     }

//     const classList = await Class.find({ courseId: new mongoose.Types.ObjectId(courseId) }).populate("courseId");
//     if (classList.length === 0) {
//       console.log('No classes found for this course ID');
//       return res.status(404).json({ success: false, message: 'No classes available for this course ID' });
//     }
//     return res.status(200).json({ success: true, message: "Retrieved all classes successfully", classList });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


exports.getAllClassByCourseId = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;

  try {
    const course = await Coures.findOne({ _id: courseId }); 
    if (!course) {
      return res.status(404).json({ status: 0, message: "Course not found" });
    }

    let hasAccess = false;
    if (course.type === "free") {
      hasAccess = true;
    } else {
      const purchase = await Purchase.findOne({ userId, courseId });  
      if(!purchase){
        hasAccess=false;
      }
      
      if (purchase) {
        hasAccess = true;
      }
    }

    let classes = await Class.find({ courseId: new mongoose.Types.ObjectId(courseId) }).populate("courseId");
    if (classes.length === 0) {
      return res.status(400).json({ status: 0, message: "No classes found for this course" });
    }

    if (!hasAccess) {
      classes = classes.map((classItem) => {
        if (!classItem.isDemo) {
          classItem.classyoutubelink = undefined;
        }
        return classItem;
      });
    }

    return res.status(200).json({status:1,message:"Retrieved all classes successfully",classes});
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.deleteClassList= async (req, res)=>{
  try{
     const classID=req.params.id;
     if(!mongoose.Types.ObjectId.isValid(classID)){
        return res.status(400).json({
          status:false,
          message:"invalid classList Id"})
     }

     const DeleteId= await Class.findByIdAndDelete(req.params.id)
     if(!DeleteId){
      return res.status(400).json({
        status:false,
        message:"Class id not found"
      })
      
     }
     res.status(200).json({
      status:true,
      Message:"Class list delete success full"
    })
  }catch(error){
    return res.status(500).json({
      success: false,
      message: error.message.toString(),
    });
  
  }
}
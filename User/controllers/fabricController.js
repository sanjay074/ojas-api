const { default: mongoose } = require("mongoose");
const fabricModal = require("../models/fabricStore");
const { fabricStore } = require("../../validators/authValidator");

const postFabricItem = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const { error } = fabricStore.validate(req.body);
    if (error) {
     return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }

    const fabricInstance = new fabricModal(data);
    const saveData = await fabricInstance.save();
    // console.log(saveData, "save data");
    // console.error(saveData)
    res
      .status(200)
      .json({ success: true, massage: " fabric data add successfully " });
  } catch (error) {
    res.status(500).json({ message: "fabric data not send ", error });
  }
};

const getFabricItem = async (req, res) => {
  try {
    const allData = await fabricModal.find({});
    if (allData.length===0) {
        return  res.status(400).json({ message: "user data is empty" });
       }
    res
      .status(200)
      .json({ success: true, message: "get all fabric data", allData });
   // console.log(allData);
   
  } catch (error) {
    res.status(400).json({ message: "fabricData not able to fetch", error });
  }
};
const deleteFabricItem = async (req, res) => {
  try {
    const fabricId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(fabricId)) {
      return res.status(500).json({ status: 0, message: "invalid delete id" });
    }
    const getData = await fabricModal.findByIdAndDelete(fabricId);

    //  console.log(getData);

    res.status(200).json({
      status: true,
      message: "fabric item delete successfully",
      
    });
  } catch (err) {
    res.status(500).json({ message: "fabric item not deleted ", err });
  }
};

const updateFabricItem = async (req, res) => {
  try {
    const fabricId = req.params.id;
    // const dbId= await fabricModal.findById({id})
   
    if (!mongoose.Types.ObjectId.isValid(fabricId)) {
      return res
        .status(400)
        .json({ status: false, message: "invalid fabric id" });
    }
    
    const updateById = await fabricModal.findByIdAndUpdate(fabricId);
    if(!updateById)
      {
       return  res.status(400).json({status:false,message:"fabric id not found"})
      }
    
    // console.log(updateById);
    res
      .status(200)
      .json({ status: true, message: "update fabric item ", updateById });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "fabric item not update ",
      error,
    });
  }
};
module.exports = {
  postFabricItem,
  getFabricItem,
  deleteFabricItem,
  updateFabricItem,
};

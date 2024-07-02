const { default: mongoose } = require("mongoose");
const fabricModal = require("../models/fabricStore");
const { fabricStore } = require("../../validators/authValidator");
const cloudinary = require("../../utils/cloudinary");

const postFabricItem = async (req, res) => {
  try {
    const data = req.body;

    const { error } = fabricStore.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: false, message: error.details[0].message });
    }

    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Missing required parameter - file"
      });
    }

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        stream.end(req.file.buffer);
      });
    };

    const result = await streamUpload(req);

    const { name, title, discount,totalPrice } = req.body;
    const discountedPrice = totalPrice - (totalPrice * (discount / 100));
    const addFabric = new fabricModal({
      name,
      title,
      totalPrice,
      price: discountedPrice,
      discount,
      imageUrl: result.secure_url
    });

    const saveData = await addFabric.save();
    return res.status(201).json({ success: true, message: "Fabric data added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Fabric data not sent", error });
  }
};


const getFabricItem = async (req, res) => {
  try {
    const getFabricItem = await fabricModal.find().sort({createdAt: -1});
    if (getFabricItem.length===0) {
        return  res.status(400).json({ message: "Fabric  data is empty" });
       }
    res
      .status(200)
      .json({ success: true, message: "Get all fabric data successfully", getFabricItem });

  } catch (error) {
     return res.status(500).json({
        status:0,
        message:error.toString()
     })
  }
};

//Token free api 
const getFabricData = async (req, res) => {
  try {
    const getFabricItem = await fabricModal.find().sort({createdAt: -1});
    if (getFabricItem.length===0) {
        return  res.status(400).json({ message: "Fabric  data is empty" });
       }
    res
      .status(200)
      .json({ success: true, message: "Get all fabric data successfully", getFabricItem });

  } catch (error) {
     return res.status(500).json({
        status:0,
        message:error.toString()
     })
  }
};

const deleteFabricItem = async (req, res) => {
  try {
      const  fabricId  = req.params.id;
      const fabric = await fabricModal.findById(fabricId);
      if (!fabric) {
          return res.status(404).json({
              status: 0,
              message: "Fabric  not found this Id"
          });
      }
    
      const imageUrl = fabric.imageUrl;
      const publicId = imageUrl.split('/').pop().split('.')[0];
   
      cloudinary.uploader.destroy(publicId, async (error, result) => {
          if (error) {
              return res.status(500).json({
                  status: 0,
                  message: error.message.toString(),
              });
          }
  
          await fabricModal.findByIdAndDelete(fabricId);
          return res.status(200).json({
              status: 1,
              message: "Fabric image and document deleted successfully"
          });
      });
  } catch (error) {
      return res.status(500).json({
          status: 0,
          message: error.message.toString(),
      });
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
  getFabricData
};

const mongoose=require("mongoose")

const fabricStore= mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    totalPrice:{
      type:Number
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
    discount:{
        type:Number,
        required:true,
    },
    imageUrl:{
        type:String
    }
   
},{timestamps: true})


const fabricModal=mongoose.model("fabric",fabricStore)
module.exports=fabricModal
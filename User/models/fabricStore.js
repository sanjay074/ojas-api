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
    price:{
        type:Number,
        required:true,
        default:0
    },
    discount:{
        type:Number,
        required:true,
    },
   
},{timestamps: true})


const fabricModal=mongoose.model("fabricModal",fabricStore)
module.exports=fabricModal
const mongoose = require("mongoose");
const classSchema = new mongoose.Schema(
  {
    couresId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coures",
      },
    classNo: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    classyoutubelink: {
      type: String,
    },
    videoWatchTime:{
        type:String
    }
},
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);

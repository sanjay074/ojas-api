const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    couresId: {  // Change courseId to couresId
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    className: {
      type: String,
      required: true,
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
    videoWatchTime: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);

const mongoose = require("mongoose");
const Coures =require("../models/coures");
const classSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coures',
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
    },
    isDemo: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);

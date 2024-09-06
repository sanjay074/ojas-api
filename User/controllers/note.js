const Coures = require("../models/coures");
const Class = require("../models/class");
const Purchase = require("../models/purchase");

const getClassesByCourseId = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user.id;
  
  try {
    const course = await Coures.findOne({_id:courseId});
    if (!course) {
      return res.status(404).json({status:0, message: "Course not found" });
    }
    let hasAccess = false;
    if (course.type === "free") {
      hasAccess = true;
    } else {
      const purchase = await Purchase.findOne({ userId, courseId });
      if (purchase) {
        hasAccess = true;
      }
    }
    let classes = await Class.find({ courseId: new mongoose.Types.ObjectId(courseId) }).populate("courseId");
    if (!hasAccess) {
      classes = classes.map((classItem) => {
        if (!classItem.isDemo) {
          classItem.classyoutubelink = undefined;
        }
        return classItem;
      });
    }

    return res.status(200).json(classes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getClassesByCourseId };




exports.buyNowOrderAndApplyCouponCode = async (req, res) => {
    try {
        const { itemId, itemType, couponCode } = req.body;
        
        if (itemType === "Coures") {
            const coures = await Coures.findOne({ _id: itemId, itemType: itemType }); 
            
            if (!coures) {
                return res.status(400).json({ success: false, message: "Course not found" });
            }
            
            let discount = 0;
            let subtotal = coures.price;
            const deliveryFee = 15;
            
            if (couponCode) {
                const coupon = await Coupon.findOne({ code: couponCode, expirationDate: { $gte: new Date() } });
    
                if (coupon) {
                    if (coupon.discountType === 'percentage') {
                        discount = (subtotal * coupon.discountValue) / 100;
                    } else if (coupon.discountType === 'amount') {
                        discount = coupon.discountValue;
                    }
                    subtotal -= discount;
                } else {
                    return res.status(400).json({ success: false, message: 'Invalid or expired coupon' });
                }
            }

            const totalAmount = subtotal + deliveryFee;
            
            res.status(200).json({
                success: true,
                message: "Get item order summary",
                coures,
                orderSummary: {
                    subtotal,
                    discount,
                    deliveryFee,
                    totalAmount
                }
            });
        } else {
            return res.status(400).json({ success: false, message: "Invalid item type" });
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message.toString(),
        });
    }
};



exports.getCart = async (req, res) => {
    const userId = req.user.id;
    const { couponCode } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const cart = await Cart.findOne({ userId }).populate('items.itemId');

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        if (cart.items.length === 0) {
            return res.status(200).json({ success: true, message: "User cart is empty", cart: { items: [] }, orderSummary: { subtotal: 0, discount: 0, deliveryFee: 0, totalAmount: 0 } });
        }

        // Calculate the subtotal
        let subtotal = cart.items.reduce((total, item) => {
            const itemPrice = item.itemId.sellPrice || item.itemId.price || 0;
            return total + (itemPrice * item.quantity);
        }, 0);

        let total = cart.item.reduce((total, item) => {
            const itemPrice = item.itemId.sellPrice || item.itemId.price || 0;
            return total + (itemPrice * item.quantity);
        }, 0)

        //Apply coupon if provided
        let discount = 0;
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

        //Define a fixed delivery fee for example,5)
        const deliveryFee = 15;

        //Calculate the total amount
        const totalAmount = subtotal - deliveryFee;

        res.status(200).json({
            success: true,
            message: "Get user cart items",
            cart,
            orderSummary: {
                subtotal,
                discount,
                deliveryFee,
                totalAmount
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message.toString(),
        });
    }
};



exports.getCart = async (req, res) => {
    const userId = req.user.id;
    const { couponCode } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    try {
        const cart = await Cart.findOne({ userId }).populate('items.itemId');

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        if (cart.items.length === 0) {
            return res.status(200).json({ success: true, message: "User cart is empty", cart: { items: [] }, orderSummary: { subtotal: 0, discount: 0, deliveryFee: 0, totalAmount: 0 } });
        }

        //Calculate the subtotal 
        let subtotal = cart.items.reduce((total, item) => {
            const itemPrice = item.itemId.sellPrice || item.itemId.price || 0;
            return total + (itemPrice * item.quantity);
        }, 0);
        
        //Calculate the totalPrice
        let total = cart.items.reduce((total, item) => {
            const itemPrice = item.itemId.totalPrice || item.itemId.price || 0;
            return total + (itemPrice * item.quantity);
        }, 0);
        
        
        //Apply coupon if provided
        let discount = 0;
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
        } else {

            discount = total - subtotal;
        }

    
        //Define a fixed delivery fee (for example, 5) 
        const deliveryFee = 15;

        //Calculate the total amount
        const totalAmount = subtotal - deliveryFee;

        res.status(200).json({
            success: true,
            message: "Get user cart items",
            cart,
            orderSummary: {
                subtotal,
                discount,
                deliveryFee,
                totalAmount
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message.toString(),
        });
    }
}





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



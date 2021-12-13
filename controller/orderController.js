const Order = require("../model/Order");
const Cart = require("../model/Cart");
const Product = require("../model/Product");

exports.createOrder = async (req, res) => {
    const user_id = req.user.id;
    
    try{
        const cart = await Cart.findOne({user: user_id});

        if(!cart){
            return res.status(400).json({
                status: "fail",
                message: "cart not found"
            });
        }
    
        var productArray = cart.cart.map((val) => { return val.product; });
        const existingProduct = await Product.find({_id: {$in: productArray}});
    
        if(existingProduct.length<productArray.length){
            return res.status(400).json({
                status: "fail",
                message: "product not fonud, check your cart"
            });
        }
        
        await Order.create({
            user: user_id,
            order: cart.cart,
            seller: existingProduct[0].seller
        });

        await Cart.deleteOne({user: user_id});
    
        return res.status(200).json({
            status: "success",
            message: "order created"
        });
    } catch(error){
        return res.status(500).json({
            status: "fail",
            message: error
        });
    }

}

exports.getOrder = async (req, res) => {
    const user_id = req.user.id;
    const user_role = req.user.role;
    let filter = {};
    user_role == "seller" ? filter.seller = user_id : filter.user = user_id;
    console.log(filter)
    const existingOrder = await Order.findOne({filter});

    if(!existingOrder){
        return res.status(400).json({
            status: "fail",
            message: "order not found"
        });
    }

    return res.status(200).json({
        status: "success",
        message: existingOrder
    })
}

exports.updateOrderStatus = async (req, res) => {
    const user_id = req.user.id;
    const user_role = req.user.role;
    const { status } = req.body;
    let filter = {};
    user_role == "seller" ? filter.seller = user_id : filter.user = user_id;

    if(!status){
        return res.status(400).json({
            status: "fail",
            message: "order need status"
        })
    }

    const existingOrder = await Order.findOne({filter});

    if(!existingOrder){
        return res.status(400).json({
            status: "fail",
            message: "order not found"
        });
    }

    existingOrder.status = status;
    existingOrder.save();

    return res.status(200).json({
        status: "success",
        message: "order status changed"
    });
}
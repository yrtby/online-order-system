const Cart = require("../model/Cart");
const Product = require("../model/Product");

exports.addCart = async (req, res) => {
    const { product, quantity } = req.body;
    const user_id = req.user.id;

    try{
        if(!(product && quantity)){
            return res.status(400).json({
                status: "fail",
                message: "all inputs is required"
            });
        }
    
        const existingProduct = await Product.findById(product);
    
        if(!existingProduct){
            return res.status(400).json({
                status: "fail",
                message: "product not found"
            });
        }
    
        const existingCart = await Cart.findOne({user: user_id});
    
        if(quantity>existingProduct.quantity){
            return res.status(400).json({
                status: "fail",
                message: "product quantity is not sufficent"
            });
        }
    
        if(!existingCart){
            await Cart.create({
                user: user_id,
                cart: {product: product, quantity: quantity}
            });
        } else{
            const existingItem = await Cart.findOne({'user': user_id,'cart.product': product});
            if(existingItem){
                await Cart.updateOne(
                    {'user': user_id},
                    {$set: {"cart.$[el].quantity": quantity } },
                    { 
                      arrayFilters: [{ "el.product": product }],
                      new: true
                    }
                );
            } else{
                existingCart.cart.push({ product: product, quantity: quantity });
                existingCart.save();
            }
        }
    
        return res.status(200).json({
            status: "success",
            message: "cart added",
        });
    }catch(error){
        return res.status(500).json({
            status: "fail",
            message: error
        });
    }
    
}

exports.getCart = async (req, res) => {
    const user_id = req.user.id;
    try{
        const existingCart = await Cart.findOne({user: user_id});

        if(!existingCart){
            return res.status(400).json({
                status: "fail",
                message: "cart not found"
            });
        }
    
        return res.status(200).json({
            status: "success",
            data: existingCart
        });
    } catch(error){
        return res.status(500).json({
            status: "fail",
            message: error
        });
    }
}

exports.deleteCart = async (req, res) => {
    const { product } = req.body;
    const user_id = req.user.id;

    if(!product){
        const existingCart = await Cart.findOne({'user': user_id});
        if(!existingCart){
            return res.status(400).json({
                status: "fail",
                message: "cart not found"
            });
        }

        await Cart.deleteOne({user: user_id});
    } else{
        const existingCart = await Cart.findOne({'user': user_id, 'cart.product': product});
        
        if(!existingCart){
            return res.status(400).json({
                status: "fail",
                message: "product not found in cart"
            });
        }

        await Cart.findOneAndUpdate(
            { 'user': user_id },
            { $pull: { cart: { product: product } } },
            { safe: true, multi: false }
        );
   
        if(existingCart.cart.length<=1){
            await Cart.deleteOne({user: user_id});
        }
    }
    
    return res.status(200).json({
        status: "success",
        message: "cart item deleted"
    });
}
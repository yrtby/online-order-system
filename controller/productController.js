const Product = require("../model/Product");

exports.createProduct = async (req, res) => {
    const { name, description } = req.body;
    const user_id = req.user.id;
    try{
        if(!(name && description)){
            return res.status(400).json({
                status: "fail",
                message: "all input is required"
            });
        }
    
        const existingProduct = await Product.findOne({name: name});
    
        if(existingProduct){
            return res.status(409).json({
                status: "fail",
                message: "product already existing"
            });
        }
    
        await Product.create({
            name: name,
            description: description,
            seller: user_id
        });
    
        return res.status(201).json({
            status: "success",
            message: "product created"
        });
    }catch(error){
        return res.status(500).json({
            status: "fail",
            message: error
        });
    }
}

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { description, quantity } = req.body;
    const user_id = req.user.id;

    console.log(req.user);

    try{
        const product = await Product.findOne({_id: id, seller: user_id});

        if(!product){
            return res.status(400).json({
                status: "fail",
                message: "product not found"
            });
        }
    
        product.description = ((description != undefined) && (description != "") && (description != null) && (description != "null")) ? description : product.description;
        product.quantity = ((quantity != undefined) && (quantity != "") && (quantity != null) && (quantity != "null") && (quantity != 0)) ? quantity : product.quantity;
        product.save();
    
        return res.status(200).json({
            status: "success",
            message: "product updated"
        });
    }catch(error){
        return res.status(500).json({
            status: "fail",
            message: error
        });
    }
}

exports.getProducts = async (req, res) => {
    const user_id = req.user.id;
    const user_role = req.user.role;
    let filter = {};

    if(user_role == "seller"){
        filter.seller = user_id;
    }

    const products = await Product.find(filter).populate('seller', '-_id business_name');

    return res.status(200).json({
        status: "success",
        data: products
    })

}
const Product = require("../models/Product");
const {verifyToken, verifyTokenAuthorisation, verifyTokenAndAdmin} = require("./verifyToken");

const router = require("express").Router();

// CREATE
router.post("/", verifyTokenAndAdmin, async (req,res) =>{
    const newProduct = new Product(req.body)

    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }catch(error) {
        res.status(500).json(error);
    }
});


// GET PRODUCT
router.get("/find/:id", async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product)
    }catch(error){
        res.status(500).json(error);
    }
});

// GET ALL PRODUCTS
router.get("/", async (req,res)=>{
    const qCategory = req.query.category;
    try{
        let products;
        if(qCategory){
            products = await Product.find({category: qCategory})
        } else {
        products = await Product.find();}
        res.status(200).json(products);
    }catch(error){
        res.status(500).json(error);
    }
});


// UPDATE
router.put("/:id", verifyTokenAuthorisation, async (req,res)=>{
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        },
        {new:true});
        res.status(200).json(updatedProduct);
    }catch(error){
        res.status(500).json(error)
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted")
    }catch(error){
        res.status(500).json(error);
    }
});


module.exports = router;
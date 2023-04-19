const Order = require("../models/Order");
const {verifyToken, verifyTokenAuthorisation, verifyTokenAndAdmin} = require("./verifyToken");

const router = require("express").Router();

// CREATE
router.post("/", verifyTokenAuthorisation, async (req,res) =>{
    const newOrder = new Order(req.body)

    try{
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    }catch(error) {
        res.status(500).json(error);
    }
});

// GET USER ORDERS
router.get("/find/:userId", verifyTokenAuthorisation,   async (req,res)=>{
    try{
        const orders = await Order.findOne({userId: req.params.userId});
        res.status(200).json(orders)
    }catch(error){
        res.status(500).json(error);
    }
});


// UPDATE
router.put("/:id", verifyTokenAuthorisation, async (req,res)=>{
    try{
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        },
        {new:true});
        res.status(200).json(updatedOrder);
    }catch(error){
        res.status(500).json(error)
    }
});

// DELETE
router.delete("/:id", verifyTokenAuthorisation, async (req,res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Order has been deleted")
    }catch(error){
        res.status(500).json(error);
    }
});


module.exports = router;
const User = require("../models/User");
const {verifyToken, verifyTokenAuthorisation, verifyTokenAndAdmin} = require("./verifyToken");

const router = require("express").Router();

// GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
        res.status(200).json({others})
    }catch(error){
        res.status(500).json(error);
    }
});

// GET ALL USERS
router.get("/find", verifyTokenAndAdmin, async (req,res)=>{
    try{
        const users = await User.find();
        res.status(200).json(users);
    }catch(error){
        res.status(500).json(error);
    }
});

// UPDATE
router.put("/:id", verifyTokenAuthorisation, async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SECRET)
            .toString();
    }
    try{
        const updateUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        },
        {new:true});
        res.status(200).json(updateUser);
    }catch(error){
        res.status(500).json(error)
    }
});

// DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted")
    }catch(error){
        res.status(500).json(error);
    }
});

module.exports = router;
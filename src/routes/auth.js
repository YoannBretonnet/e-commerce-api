const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req,res)=> {
    const newUser = new User ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
        });

        try {
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        }
        catch (error) {
            res.status(500).json(error);
        }
    });

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        const password = user.password;

        if (!user) {
            res.status(401).json("Wrong credentials");
        } else {
            if (password !== req.body.password) {
                res.status(401).json("Wrong password");
            } else {
                const accessToken = jwt.sign({
                    id:user._id, 
                    isAdmin: user.isAdmin,
                },
                process.env.JWT_SECRET,
                {expiresIn:"3d"}
                );
                const { password, ...others } = user._doc;
                res.status(200).json({...others, accessToken});
            }
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
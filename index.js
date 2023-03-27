const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth")

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: {
      j: true,
      wtimeout: 1000,
      w: "majority"
    }
};

dotenv.config();

mongoose
.connect(process.env.MONGO_URL, options)
.then(()=> console.log("DB connection sucessfull"))
.catch((error)=> {
    console.log(error)
})

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.listen(process.env.PORT || 5000, ()=> {
    console.log("server is running")
})
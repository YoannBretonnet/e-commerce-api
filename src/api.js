const express = require("express");
const serverless = require("serverless-http");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe")
const cors = require("cors");

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

app.get("/", async (request, response) => {
  console.log("hey");
  response.send({ hello: "world" });
});

app.use(cors());
app.use("/.netlify/functions/api", router);
app.use("/.netlify/functions/api/auth", authRoute);
app.use("/.netlify/functions/api/users", userRoute);
app.use("/.netlify/functions/api/products", productRoute);
app.use("/.netlify/functions/api/carts", cartRoute);
app.use("/.netlify/functions/api/orders", orderRoute);
app.use("/.netlify/functions/api/checkout", stripeRoute);

app.listen(process.env.PORT || 5000, ()=> {
    console.log("server is running")
})

const handler = serverless(app);
module.exports.handler = async (event, context) => {
  const result = await handler(event, context);
  return result;
};
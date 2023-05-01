import cookieParser from 'cookie-parser'
import express from 'express'
import {json} from 'express'
import {Router} from 'express'
import serverless from 'serverless-http'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'

import {authRoute} from './routes/auth.js'
import {userRoute} from './routes/user.js'
import {productRoute} from './routes/product.js'
import {cartRoute} from './routes/cart.js'
import {orderRoute} from './routes/order.js'
import {stripeRoute} from './routes/stripe.js'

export async function handler(event, context) {
const app = express();
const router = Router()

router.get('/auth', authRoute)
router.get('/users', userRoute)
router.get('/products', productRoute)
router.get('/carts', cartRoute)
router.get('/orders', orderRoute)
router.get('/checkout', stripeRoute)

router.get("/", async (request, response) => {
  console.log("hey");
  response.send({ hello: "world" });
});

app.use(express.json());
app.use(cors());

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

app.use("/.netlify/functions/api/auth", authRoute);
app.use("/.netlify/functions/api/users", userRoute);
app.use("/.netlify/functions/api/products", productRoute);
app.use("/.netlify/functions/api/carts", cartRoute);
app.use("/.netlify/functions/api/orders", orderRoute);
app.use("/.netlify/functions/api/checkout", stripeRoute);

app.use('/api/', router)
return serverless(app)(event, context)
}

app.listen(process.env.PORT || 5000, ()=> {
    console.log("server is running")
})

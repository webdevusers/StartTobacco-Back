const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 5175;

const authRouter = require('./Auth/Router/AuthRouter')
const productRouter = require('./Products/Router/Router')
const orderRouter = require('./Orders/router/router')
const reviewRouter = require('./Reviews/router/router')
const msgRouter = require('./Messages/router/router')
const seoRouter = require('./SEO/router/index')
const blogRouter = require('./blog/router/router')

app.use(cors())
app.use(express.json())

app.use("/user", authRouter)
app.use("/items", productRouter)
app.use("/order", orderRouter)
app.use("/review", reviewRouter)
app.use("/msg", msgRouter)
app.use("/seo", seoRouter)
app.use('/blog', blogRouter)

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://devusersvue:J5ExNcqnAN6cC4n9@starttobacco.qp2fq2p.mongodb.net/');
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});    } catch (e) {
        console.log(e)
    }
}
start();

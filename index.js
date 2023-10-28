const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const app = express()
const PORT = 8080

const authRouter = require('./Auth/Router/AuthRouter')
const productRouter = require('./Products/Router/Router')


app.use(cors())
app.use(express.json())

app.use("/user", authRouter)
app.use("/items", productRouter)

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://devusersvue:jXSFM1kfpDMF7RB7@starttobacco.qp2fq2p.mongodb.net/?retryWrites=true&w=majority');
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start();
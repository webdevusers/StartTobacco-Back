const Order = require('../models/Order')

class OrderController {
    async create(req, res) {
        try {
            const {
                name,
                surname,
                typeDelivery,
                deliveryAddress,
                typePayment,
                phone,
                status,
                order
            } = req.body;

            if (!name && !surname) {
                res.status(400).json({client: 'empty'})
            }
            const createorder = await new Order({
                name,
                surname,
                typeDelivery,
                deliveryAddress,
                typePayment,
                phone,
                status,
                order
            }).save()
            res.status(200).json({order: "created"})
        } catch(e) {
            console.log(e)
        }
    }
    async get(req, res) {
        try {
            const Orders = await Order.find();
            res.status(200).json({Orders})
        } catch(e) {
            console.log(e)
        }
    }
    async delete(req, res) {
        try {
            const {id} = req.body;
            const order = await Order.findByIdAndDelete(id);
            res.status(200).json({deleted: "true"})
        } catch(e) { 
            console.log(e)         
            res.status(500).json({error: "An error occurred"});
        }
    }
}

module.exports = new OrderController();

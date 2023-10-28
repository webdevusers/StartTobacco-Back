const {Schema, model} = require('mongoose')

const User = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        ref: 'Role'
    }],
    liked: [{
        type: Object,
    }],
    orders: [{
        type: Object,
    }],
})

module.exports = model('User', User)
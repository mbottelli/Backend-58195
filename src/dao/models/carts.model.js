const mongoose = require('mongoose')
const ProductModel = require('./products.model')

const cartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref:'products'
                },
                cantidad:Number
            }
        ]
    }
})

cartSchema.pre('find', function(next){
    this.populate('products.product')
    next()
})
cartSchema.pre('findOne', function(next){
    this.populate('products.product')
    next()
})

const CartModel = mongoose.model('carts', cartSchema)

module.exports = CartModel
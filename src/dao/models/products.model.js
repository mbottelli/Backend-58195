const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const productSchema = new mongoose.Schema({
    title: {
        type:String,
        index:true
    },
    description:String,
    price:Number,
    thumbnail: {
        type:String,
        default:'Sin imagen'
    },
    code: {
        type:String,
        index:true
    },
    status:Boolean
})
productSchema.plugin(mongoosePaginate)

const ProductModel = mongoose.model('products', productSchema)

module.exports = ProductModel
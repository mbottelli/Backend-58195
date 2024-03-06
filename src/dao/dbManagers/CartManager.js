const { isStringObject, isNumberObject } = require('util/types');
const CartModel = require('../models/carts.model')
const ProductManager = require('./ProductManager');
const prod = new ProductManager()

class CartManager {

    constructor (){
        this.carts = []
        this.response = {
            code: 200,
            message: 'Success'
        }
    }

    resUpdate(response, message){
        this.response.code = response
        this.response.message = message
        return this.response
    }

    async addCart(){
        this.carts = [{products: []}]
        let res
        try {res = await CartModel.create(this.carts)}
        catch (error) {return error}
        let reqRes = this.resUpdate(200, 'Success')
        reqRes.cartid = res._id
        return reqRes
    }

    async getAllCarts(){
        // Hecho para debugear
        return await CartModel.find().lean()
    }

    async getCart(id){
        try {this.carts = await CartModel.findById(id).lean()}
        catch (error) {return this.resUpdate(404, 'Id no encontrado')}
        return this.carts
    }

    async updateCart(id, update){
        // todo: validacion
        // update tiene que venir como array de objetos
        try{await CartModel.findByIdAndUpdate(id, {$set: {products:update}}).lean()}
        catch(error){return error}
        return this.resUpdate(200, 'Success')
    }

    async deleteCart(id){
        try {await CartModel.findByIdAndUpdate(id, {$set: {products:[]}}).lean()}
        catch (error) {return error}
        return this.resUpdate(200, 'Success')
    }

    async addProduct(cartId, productId, cantidad){
        // todo: Validación para productId
        let validacion = {cantidad}
        for (let key in validacion) {
            let esNumero = Number.isInteger(validacion[key])
            let esRacional = isFinite(validacion[key])
            let esPositivo =  (validacion[key] > 0)
            let esEntero = (validacion[key] % 1 == 0)
            if ( !(esNumero && esRacional && esPositivo && esEntero) ) {return this.resUpdate(400, `Valor ${key} erroneo`)}
        }
        await this.getCart(cartId)
        if (this.carts.code) {return this.carts}

        let prodArray = this.carts.products
        let busqueda = prodArray.find(x => x.product._id.toString() == productId)

        if (busqueda === undefined) {
            let prodObj = {product: productId, cantidad: cantidad}
            try {await CartModel.findByIdAndUpdate(cartId,{$push:{products: prodObj}})}
            catch(error){console.log(error)}
        } else {
            let pindex = prodArray.findIndex(x => x.product._id.toString() == productId)
            cantidad += prodArray[pindex].cantidad
            await CartModel.findOneAndUpdate(
                {_id: cartId, products: {$elemMatch: {product: productId}}},
                {$set: {'products.$.cantidad': cantidad}}
            )
        }

        return this.resUpdate(200, 'Success')
    }

    async updateProduct(cartId, productId, cantidad){
        // todo: validacion
        try{
            await CartModel.findOneAndUpdate(
            {_id: cartId, products: {$elemMatch: {product: productId}}},
            {$set: {'products.$.cantidad': cantidad.cantidad}}
        )}
        catch(error){return error}
        return this.resUpdate(200, 'Success')
    }

    async deleteProduct(cartId, productId){
        await this.getCart(cartId)
        if (this.carts.code) {return this.carts}

        try {await CartModel.findOneAndUpdate(
            {_id: cartId, products: {$elemMatch: {product: productId}}},
            {$pull: {products: {product:productId}}}
        )}
        catch (error) {return error}

        return this.resUpdate(200, 'Success')
    }
}

module.exports = CartManager;
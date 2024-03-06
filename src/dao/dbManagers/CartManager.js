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

    checkWholeNumber(objeto) {
        // Recibe objetos, chequeo de número modularizado
        for (let key in objeto) {
            let esNumero = Number.isInteger(objeto[key])
            let esRacional = isFinite(objeto[key])
            let esPositivo =  (objeto[key] > 0)
            let esEntero = (objeto[key] % 1 == 0)
            if ( !(esNumero && esRacional && esPositivo && esEntero) ) {objeto[key] = false}
            else {objeto[key] = true}
        }
        return objeto
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
        catch (error) {return error}
        return this.carts
    }

    async updateCart(id, update){
        // update tiene que venir como array de objetos
        // Si viene un objeto solo es mas facil meterlo dentro de un array
        if (typeof update != 'array') { update = [update]}
        await this.getCart(id)
        let prodArray = this.carts.products
        for (let i = 0; i < update.length; i++) {
            // Limpia objetos que no tengan las propiedades product o cantidad
            if (!update[i].product || !update[i].cantidad) {
                console.log(`Objeto removido 1 - ${JSON.stringify(update[i])}`)
                update[i] = {}
                continue
            }
            for (var key in update[i]) {
                // Remueve cualquier propiedad adicional
                if (key != 'product' && key != 'cantidad'){
                    console.log(`Propiedad ${update[i][key]} removida`)
                    delete update[i][key]
                    continue
                }
                // Solo deberían quedar product y cantidad, que tienen que ser String o Number
                if (typeof update[i][key] != 'string' && typeof update[i][key] != 'number') {
                    console.log(`Objeto removido 2 - ${JSON.stringify(update[i])}`)
                    update[i] = {}
                    continue
                }
            }
            // Finalmente verifica que el producto esté adentro del carrito
            let busqueda = prodArray.find(x => x.product._id.toString() == update[i].product)
            if (!busqueda) {
                console.log(`Objeto removido 3 - ${JSON.stringify(update[i])}`)
                update[i] = {}
                continue
            }
        }
        update = update.filter(value => Object.keys(value).length !== 0)
        if (update.length === 0) { return this.resUpdate(400, 'Error') }


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
        if (!this.checkWholeNumber(validacion)) {return this.resUpdate(400, 'Error')}
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
        try{await CartModel.findOneAndUpdate(
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
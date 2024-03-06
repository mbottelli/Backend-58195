const { isStringObject, isNumberObject } = require('util/types');
const ProductModel = require('../models/products.model')

class ProductManager {

    constructor (){
        this.productos = []
        this.response = {
            code: 200,
            message: 'Success'
        }
        this.properties = {
            _id: 0,
            title: '',
            description: '',
            price: 0,
            thumbnail: 'Sin imagen',
            code: '',
            status: true
        }
    }

    chequeoObjeto(a) {
        let propiedades = this.properties
        delete propiedades['_id']
        if (!('thumbnail' in a)) a.thumbnail = this.properties.thumbnail

        let aKeys = Object.keys(a).sort()
        let pKeys = Object.keys(propiedades).sort()
        return JSON.stringify(aKeys) === JSON.stringify(pKeys)
    }

    prepareResponse(response, status){
        this.productos = Object.assign({status: status.message}, response) //Para que quede al principio
        delete this.productos.totalDocs
        delete this.productos.limit
        delete this.productos.pagingCounter
        this.productos.prevLink = 'link acá'
        this.productos.nextLink = 'link allá'
        // Y un link te saludara
        return this.productos
    }

    resUpdate(response, message){
        this.response.code = response
        this.response.message = message
        return this.response
    }

    async getProducts(limit,page,sort,query){
        limit = limit || 10
        page = page || 1
        // todo: Agregar validacion
        let reqOptions = {lean: true}
        const reqQueries = [{limit:limit}, {page:page}, {sort:sort}, {select:query}]
        for (let i = 0; i < reqQueries.length; i++) {
            let [property] = Object.entries(reqQueries[i])
            if(!property[1]){continue}
            if(property[0] === 'sort'){
                reqOptions[property[0]] = {price:property[1]}
                continue
            }
            reqOptions[property[0]] = property[1]
        }

        try {this.prepareResponse(await ProductModel.paginate({}, reqOptions), this.resUpdate(200, 'Success'))}
        catch (error){return this.resUpdate(400, 'Error')}
        return this.productos
    }

    async getProductById(id){
        try {this.productos = await ProductModel.findById(id).lean()}
        catch (error) {return this.resUpdate(404, 'Id no encontrado')}
        return this.productos
    }

    async addProduct(producto){
        // Validacion
        if ('id' in producto || '_id' in producto) {return this.resUpdate(400, 'El valor id no puede ser especificado al crear un objeto')}
        if (!this.chequeoObjeto(producto)) {return this.resUpdate(400, 'Propiedades faltantes o inexistentes')}
        if (!producto.thumbnail) producto.thumbnail = this.properties.thumbnail
        for(var key in producto){
            if (!producto[key]) {return this.resUpdate(400, `El valor de la propiedad ${key} es erroneo`)}
            else if (typeof producto[key] !== typeof this.properties[key]) {return this.resUpdate(400, `El valor de la propiedad ${key} no es del tipo ${typeof this.properties[key]}`)}
        }
        let chequeo = await ProductModel.find({code:producto.code}).lean()
        if (chequeo.length != 0) {return this.resUpdate(400, `Codigo ${producto.code} repetido`)}

        let res
        try {res = await ProductModel.create(producto)}
        catch (error) {return this.resUpdate(400, 'Error')}

        let reqRes = this.resUpdate(200, 'Success')
        reqRes.productid = res._id
        return reqRes
    }

    async updateProduct (id, update) {
        if ('id' in update || '_id' in update) {
            delete update['id']
            delete update ['_id']
            console.warn('updateProduct() - Valor id removido de la solicitud') // No pueden actualizar el ID
        }

        // Validacion
        for(var key in update){
            if (!update[key]) {return this.resUpdate(400, `La propiedad ${key} es erronea`)}
            else if (!(key in this.properties)){
                delete update[key]
                console.warn(`Propiedad ${key} removida`)
                continue
            } else if (typeof update[key] !== typeof this.properties[key]) {return this.resUpdate(400, `La propiedad ${key} no es del tipo ${typeof this.properties[key]}`)}
        }

        try {await ProductModel.findByIdAndUpdate(id, update)}
        catch (error) {return this.resUpdate(404, 'Id no encontrado')}
        return this.resUpdate(200, 'Success')
    }

    async deleteProduct (id) {
        let operation = await ProductModel.findByIdAndDelete(id)
        if (operation === null) {return this.resUpdate(404, 'Id no encontrado')}
        return this.resUpdate(200, 'Success')
    }
}

module.exports = ProductManager;

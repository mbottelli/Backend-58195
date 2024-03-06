const fs = require('fs');
const { isStringObject, isNumberObject } = require('util/types');

class ProductManager {
    #id = 1

    constructor (path, file){
        this.folder = path 
        this.path = path + file
        this.productos = []
        this.response = {
            code: 200,
            message: 'Success'
        }
        this.properties = {
            id: 0,
            title: '',
            description: '',
            price: 0,
            thumbnail: 'Sin imagen',
            code: '',
            status: true
        }
    }

    chequeo(){
        if (fs.existsSync(this.path) === true) {
            return true
        } else {
            console.warn('chequeo() - Archivo no encontrado')
            return false
        }
    }

    lector(){
        if (this.chequeo() !== true) {
            console.warn ('lector() - Lectura fallida')
            return false
        } 
        let archivo = fs.readFileSync(this.path);
        this.productos = JSON.parse(archivo)
        this.#id = (Math.max(...this.productos.map(producto => producto.id)) + 1) // Busca cual es el ID mas grande y le suma 1
        // Esta solución me gusta mas que la anterior, pero van a quedar IDs vacios
        // La unica excepcion es cuando se borrara el ultimo ID de la lista, en ese caso se recicla

        if (isFinite(this.#id) === false) this.#id = 1
        // Si el archivo se inicializa con un objeto vacio, la evaluación anterior es igual a -Infinity
        // De esta manera, al evaluarse un número infinito positivo, negativo, o NaN, simplemente revierte el valor a 1
        // Podría traer problemas si el input de IDs al crear objetos fuese manual, pero en este caso debería ser siempre automático y transparente para el usuario

        return true
    }

    escritor(){
        if (!fs.existsSync(this.folder)) fs.mkdirSync(this.folder, { recursive: true }) // Ahora si el directorio proporcionado no existe lo crea
        fs.writeFileSync(this.path, JSON.stringify(this.productos))
        return true
    }

    chequeoObjeto(a) {
        let propiedades = this.properties
        delete propiedades['id']

        if (!('thumbnail' in a)) a.thumbnail = this.properties.thumbnail

        let aKeys = Object.keys(a).sort()
        let pKeys = Object.keys(propiedades).sort()
        
        return JSON.stringify(aKeys) === JSON.stringify(pKeys)
    }

    resUpdate(response, message){
        this.response.code = response
        this.response.message = message
        console.warn(message)
        return this.response
    }

    getProducts(){
        if (this.lector() !== true) {
            console.error('getProducts() - No se encontraron productos')
            return this.productos
        }
        return this.productos;
    }

    getProductById(id){
        this.lector();
        let busqueda = this.productos.find(x => x.id === id)
        if (busqueda != undefined) {
            return busqueda;
        } else {
            return this.resUpdate(404, `ID ${id} no encontrado`)
        }
    }

    addProduct(producto){
        if ('id' in producto) {
            return this.resUpdate(400, 'El valor id no puede ser especificado al crear un objeto')
        }
        // Primer chequeo para que no incluyan ID en la propiedades

        if (!this.chequeoObjeto(producto)) {
            return this.resUpdate(400, 'Propiedades faltantes o inexistentes')
        }
        // Segundo chequeo para validar las propiedades, que tenga todas las requeridas y sean validas; separe el ID para tener mejor trazabilidad del error.

        if (!producto.thumbnail) producto.thumbnail = this.properties.thumbnail
        // Porque si no lo incluyen tiene que ir a un default

        for(var key in producto){
            if (!producto[key]) {
                return this.resUpdate(400, `El valor de la propiedad ${key} es erroneo`)

            } else if (typeof producto[key] !== typeof this.properties[key]) {
                return this.resUpdate(400, `El valor de la propiedad ${key} no es del tipo ${typeof this.properties[key]}`)
            }
        }
        // Con este ultimo chequeo se vuelve obligatorio que los datos existan y sean del tipo requerido
        // Igualmente siento que de alguna manera puedo modularizarlo
        // Al final no renege tanto como pensaba, me faltaría validar que el string de thumbnail sea un path valido

        this.lector();
        let chequeo = this.productos.find(x => x.code === producto.code);
        if (chequeo != undefined){
            return this.resUpdate(400, `Codigo ${producto.code} repetido`)
        }
        
        producto = Object.assign({id: this.#id}, producto) // Para agregar el ID al principio del producto

        this.productos.push(producto)
        this.escritor();
        return this.resUpdate(200, 'Success')
    }

    updateProduct (id, update) {
        if ('id' in update) {
            delete update['id']
            console.warn('updateProduct() - Valor id removido de la solicitud') // No pueden actualizar el ID
        }

        for(var key in update){
            if (!update[key]) {
                return this.resUpdate(400, `La propiedad ${key} es erronea`)
            } else if (!(key in this.properties)){
                delete update[key]
                console.warn(`Propiedad ${key} removida`)
                continue
            } else if (typeof update[key] !== typeof this.properties[key]) {
                return this.resUpdate(400, `La propiedad ${key} no es del tipo ${typeof this.properties[key]}`)
            }
        }
        // En addProduct hago la excepción para el thumbnail
        // Aca no tiene sentido actualizar thumbnail por un valor falsey, solo para que vuelva a insertar el default

        this.lector();
        
        let i = this.productos.findIndex(x => x.id === id)
        if (this.productos[i] == undefined) {
            return this.resUpdate(404, `ID ${id} no encontrado`)
        }

        let [property] = Object.keys(update); 
        let [value] = Object.values(update);
        // Desestructura el objeto para usar la propiedad y el valor
        // Mas adelante se puede reutilizar para cambiar mas de 1 campo en una sola llamada
        let busqueda = this.getProductById(id);

        busqueda[property] = value
        this.productos.splice((i), 1, busqueda)
        this.escritor()
        return this.resUpdate(200, 'Success')
    }

    deleteProduct (id) {
        this.lector()
        let i = this.productos.findIndex(x => x.id === id)
        if (this.productos[i] == undefined) {
            return this.resUpdate(404, `ID ${id} no encontrado`)
        }
        this.productos.splice((i), 1)
        this.escritor() !== true
        return this.resUpdate(200, 'Success')
    }
}

module.exports = ProductManager;
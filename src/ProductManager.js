const fs = require('fs');
const { isStringObject, isNumberObject } = require('util/types');

class ProductManager {
    #id = 1

    constructor (path, file){
        this.folder = path 
        this.path = path + file
        this.productos = []
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
            console.warn('getProductsById() - ID no encontrado')
            return false
        }
    }

    addProduct(producto){
        if ('id' in producto) {
            console.warn('addProduct() - El valor de ID no puede ser insertado')
            return false
        }
        // Primer chequeo para que no incluyan ID en la propiedades

        if (!this.chequeoObjeto(producto)) {
            console.warn(`addProduct() - Propiedad/es faltante/s`)
            return false
        }
        // Segundo chequeo para validar las propiedades, que tenga todas las requeridas y sean validas; separe el ID para tener mejor trazabilidad del error.

        if (!producto.thumbnail) producto.thumbnail = this.properties.thumbnail
        // Porque si no lo incluyen tiene que ir a un default

        for(var key in producto){
            if (!producto[key]) {
                console.warn(`addProduct() - La propiedad ${key} es erronea`)
                return false
            } else if (typeof producto[key] !== typeof this.properties[key]) {
                console.warn(`addProduct() - La propiedad ${key} no es del tipo ${tipoRequerido}`)
                return false
            }
        }
        // Con este ultimo chequeo se vuelve obligatorio que los datos existan y sean del tipo requerido
        // Igualmente siento que de alguna manera puedo modularizarlo
        // Al final no renege tanto como pensaba, me faltaría validar que el string de thumbnail sea un path valido



        this.lector();
        let chequeo = this.productos.find(x => x.code === producto.code);
        if (chequeo != undefined){
            console.warn(`addProduct() - Codigo ${producto.code} repetido`)
            return false
        }
        
        producto = Object.assign({id: this.#id}, producto) // Para agregar el ID al principio del producto

        this.productos.push(producto)
        this.escritor();
        return true
    }

    updateProduct (id, update) {
        if ('id' in update) {
            console.warn('updateProduct() - El valor de ID no puede ser actualizado')
            return false
        }
        // El ID no se debe poder actualizar
        for(var key in update){
            let tipoPropiedad = typeof update[key]
            let tipoRequerido = typeof this.properties[key]
            if (!update[key]) {
                console.warn(`updateProduct() - La propiedad ${key} es erronea`)
                return false
            } else if (!(key in this.properties)){
                console.warn(`updateProduct() - La propiedad ${key} no es valida`)
                return false
            } else if (tipoPropiedad !== tipoRequerido) {
                console.warn(`updateProduct() - La propiedad ${key} no es del tipo ${tipoRequerido}`)
                return false
            }
        }
        // En addProduct hago la excepción para el thumbnail
        // Aca no tiene sentido actualizar thumbnail por un valor falsey, solo para que vuelva a insertar el default

        this.lector();
        
        let i = this.productos.findIndex(x => x.id === id)
        if (this.productos[i] == undefined) {
            console.warn('updateProduct() - ID no encontrado')
            return false
        }

        let [property] = Object.keys(update); 
        let [value] = Object.values(update);
        // Desestructura el objeto para usar la propiedad y el valor
        // Mas adelante se puede reutilizar para cambiar mas de 1 campo en una sola llamada
        let busqueda = this.getProductById(id);

        busqueda[property] = value
        this.productos.splice((i), 1, busqueda)
        this.escritor()
        return true
    }

    deleteProduct (id) {
        if (this.lector() !== true) { 
            console.warn('deleteProduct() - Lectura fallida')
            return false
        }
        let i = this.productos.findIndex(x => x.id === id)
        if (this.productos[i] == undefined) {
            console.warn('deleteProduct() - ID no encontrado')
            return false
        }
        this.productos.splice((i), 1)
        if (this.escritor() !== true) {
            console.warn('deleteProduct() - Escritura fallida')
            return false
        }
        return true
    }
}

module.exports = ProductManager;

// --------------------------------------------------------------------------

// console.log(manager.addProduct('Producto 1', 'Este es el producto 1', 37, 'Sin imagen', 'PRD1', 11))
// console.log(manager.addProduct('Producto 2', 'Este es el producto 2', 64, 'Sin imagen', 'PRD2', 12))
// console.log(manager.addProduct('Producto 3', 'Este es el producto 3', 28, 'Sin imagen', 'PRD3', 13))
// console.log(manager.addProduct('Producto 4', 'Este es el producto 4', 18, 'Sin imagen', 'PRD4', 14))
// console.log(manager.addProduct('Producto 5', 'Este es el producto 5', 24, 'Sin imagen', 'PRD5', 15))
// console.log(manager.addProduct('Producto 6', 'Este es el producto 6', 53, 'Sin imagen', 'PRD6', 16))
// console.log(manager.addProduct('Producto 7', 'Este es el producto 7', 81, 'Sin imagen', 'PRD7', 17))
// console.log(manager.addProduct('Producto 8', 'Este es el producto 8', 76, 'Sin imagen', 'PRD8', 18))
// console.log(manager.addProduct('Producto 9', 'Este es el producto 9', 54, 'Sin imagen', 'PRD9', 19))
// console.log(manager.addProduct('Producto 10', 'Este es el producto 10', 39, 'Sin imagen', 'PRD10', 110))

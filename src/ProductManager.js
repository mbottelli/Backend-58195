const fs = require('fs');
const { isStringObject, isNumberObject } = require('util/types');

class ProductManager {
    #id = 1

    constructor (file){
        this.path = file
        this.productos = []
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
        return true
    }

    escritor(){
        fs.writeFileSync(this.path, JSON.stringify(this.productos))
        return true
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
        this.lector();
        let chequeo = this.productos.find(x => x.code === producto.code);
        if (chequeo != undefined){
            console.warn(`addProduct() - Codigo ${code} repetido`)
            return false
        }
        if (!producto.thumbnail) {
            producto.thumbnail = 'Sin imagen'
        }
        if (!producto.status) {
            producto.status = true
        }
        
        producto = Object.assign({id: this.#id}, producto) // Para agregar el ID al principio del producto
        // Mas adelante me tocará renegar con la validacion del tipo de dato

        for(var key in producto) {
            if(!producto[key]) {
                console.warn(`addProduct() - Valor ${key} erroneo o vacio`)
                return false
            }
        }

        this.productos.push(producto)
        this.escritor();
        return true
    }

    updateProduct (id, update) {
        this.lector();
        let i = this.productos.findIndex(x => x.id === id)
        if (this.productos[i] == undefined) {
            console.warn('updateProduct() - ID no encontrado')
            return false
        }
        
        let [property] = Object.keys(update); 
        let [value] = Object.values(update);
        // Desestructura el array para usar la propiedad y el valor
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

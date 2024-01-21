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
        this.#id = Number(Object.keys(this.productos)[Object.keys(this.productos).length - 1]) + 2
        // Revisa los objetos ya existentes y setea #id al proximo disponible
        // Si se borrara un ID anterior se repetirían IDs, en un entorno real capaz sea mejor no borrar el objeto para mantener la secuencia y simplemente vaciar las propiedades.
        // O usar otra forma de setear IDs
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

    addProduct(title, description, price, thumbnail, code, stock){
        this.lector();
        let chequeo = this.productos.find(x => x.code === code);
        if (chequeo != undefined){
            console.warn(`addProduct() - Codigo ${code} repetido`)
            return false
        }

        let producto = {}
        producto.id = this.#id++;
        producto.title = title;
        producto.description = description;
        producto.price = price;
        producto.thumbnail = thumbnail;
        producto.code = code;
        producto.stock = stock;

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

    updateProduct (id, campo, valor) {
        if (this.lector() !== true) { 
            console.warn('updateProduct() - Lectura fallida')
            return false
        }
        let i = id - 1
        if (this.productos[i] == undefined) {
            console.warn('updateProduct() - ID no encontrado')
            return false
        }
        let busqueda = this.getProductById(id);
        busqueda[campo] = Number(valor)
        this.productos.splice((i), 1, busqueda)
        if (this.escritor() !== true) {
            console.warn('updateProduct() - Escritura fallida')
            return false
        }
        return true
    }

    deleteProduct (id) {
        if (this.lector() !== true) { 
            console.warn('deleteProduct() - Lectura fallida')
            return false
        }
        let i = id - 1
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

// Estos son los comandos de la prueba para el desafío 2

// const manager = new ProductManager('./test.json');

// console.log(manager.getProducts())
// console.log(manager.addProduct('producto de prueba', 'Este es un producto prueba', 200, 'Sin imagen', '321', 25))
// console.log(manager.getProductById(1))
// console.log(manager.updateProduct(1, 'price', 28))
// console.log(manager.deleteProduct(1))

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

const fs = require('fs');
const { isStringObject, isNumberObject } = require('util/types');

class CartManager {
    #id = 1

    constructor(file){
        this.path = file
        this.carts = []
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
        this.carts = JSON.parse(archivo)
        this.#id = (Math.max(...this.carts.map(producto => producto.id)) + 1) // Busca cual es el ID mas grande y le suma 1
        // Esta solución me gusta mas que la anterior, pero van a quedar IDs vacios
        // La unica excepcion es cuando se borrara el ultimo ID de la lista, en ese caso se recicla
        return true
    }

    escritor(){
        fs.writeFileSync(this.path, JSON.stringify(this.carts))
        return true
    }

    addCart(){
        this.lector();
        this.carts.push({id:this.#id, products:[]});
        this.escritor();
        return true;
    }

    getCart(id){
        this.lector();
        let busqueda = this.carts.find(x => x.id === id)
        if (busqueda != undefined) {
            return busqueda
        } else {
            console.warn('getCart() - ID no encontrado')
            return false
        }
    }

    addProduct(cartId, productId, cantidad){
        let carrito = this.getCart(cartId)
        if (carrito === false) {
            console.warn('addProduct() - cartID no encontrado')
            return false
        }

        let ci = this.carts.findIndex(x => x.id === cartId) // Asigna el indice del carrito con el ID correspondiente
        let pi = carrito.products.findIndex(x => x.product === productId) // Asigna el indice del producto con el ID correspondiente dentro del carrito llamado

        if (pi == -1) {
            let prodArray = {product:productId, quantity:cantidad}
            carrito.products.push(prodArray)
        } else {
            carrito.products[pi].quantity = (carrito.products[pi].quantity + cantidad)
        }

        this.carts.splice((ci), 1, carrito)
        this.escritor();
        return true
    }
}

module.exports = CartManager;
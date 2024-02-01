const fs = require('fs');
const { isStringObject, isNumberObject } = require('util/types');

class CartManager {
    #id = 1

    constructor(path){
        this.folder = path
        this.path = path + '/carritos.json'
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
        let archivo = fs.readFileSync(this.path)
        this.carts = JSON.parse(archivo)
        this.#id = (Math.max(...this.carts.map(carrito => carrito.id)) + 1)// Busca cual es el ID mas grande y le suma 1
        // Esta solución me gusta mas que la anterior, pero van a quedar IDs vacios
        // La unica excepcion es cuando se borrara el ultimo ID de la lista, en ese caso se recicla

        if (isFinite(this.#id) === false) this.#id = 1
        // Si el archivo se inicializa con un objeto vacio, la evaluación anterior de this.#id es igual a -Infinity
        // De esta manera, al evaluarse un número infinito positivo, negativo, o NaN, simplemente revierte el valor a 1
        // Podría traer problemas si el input de IDs al crear objetos fuese manual, pero en este caso debería ser siempre automático y transparente para el usuario

        return true
    }

    escritor(){
        if (!fs.existsSync(this.folder)) fs.mkdirSync(this.folder, { recursive: true }) // Ahora si el directorio proporcionado no existe lo crea
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
        let validacion = {cartId, productId, cantidad}
        for (let key in validacion) {
            let esNumero = Number.isInteger(validacion[key])
            let esRacional = isFinite(validacion[key])
            let esPositivo =  (validacion[key] > 0)
            let esEntero = (validacion[key] % 1 == 0)
            if ( !(esNumero && esRacional && esPositivo && esEntero) ) {
                console.warn(`addProduct() - Valor ${key} erroneo` )
                return false
            }
        }
        // Valida que los valores introducidos sean numeros, racionales, positivos y enteros; en este caso ayuda que sean todos numeros
        // Puse las comparaciones lógicas en sus propias variables para que sea legible, ya que chequeo varias cosas
        // La logica del if fue lo mejor que se me ocurrio, capaz haya una mejor manera de hacerlo

        let carrito = this.getCart(cartId)
        if (carrito === false) {
            console.warn('addProduct() - cartID no encontrado')
            return false
        }
        
        let productosPath = __dirname+'/./files/productos.json'
        let productosFile = JSON.parse(fs.readFileSync(productosPath))
        if (!(productosFile.find(x => x.id === productId))) {
            console.warn('addProduct() - Producto inexistente')
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
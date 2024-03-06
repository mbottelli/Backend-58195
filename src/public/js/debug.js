// Hecho para debugear

const socket = io()

socket.emit('prodRequest', 'solicitud emitida')
socket.emit('cartRequest', 'solicitud emitida')

socket.on('prodUpdate', ()=>{
    socket.emit('prodRequest', 'solicitud emitida')
})
socket.on('cartUpdate', ()=>{
    socket.emit('cartRequest', 'solicitud emitida')
})

socket.on('prodResponse', (productos)=>{
    productos = productos.docs
    let resultado = ''
    for (let i = 0; i < productos.length; i++) {
        
        resultado += '<li>'
        const producto = productos[i];
        for (var key in producto){
            if (key == '__v') {
                break
            }
            resultado += ' - ' + producto[key]
        }
        resultado += '</li>'
    }
    console.log(`DOM update for ${socket.id}`)
    document.getElementById("productList").innerHTML = resultado
})
socket.on('cartResponse', (carritos)=>{
    let resultado = ''
    delete carritos.__v
    for (let i = 0; i < carritos.length; i++) {
        resultado += '<li>'
        const carrito = carritos[i];
        for (var key in carrito){
            if (key == 'products') {
                resultado += '<ul>'
                for (let i = 0; i < carrito[key].length; i++) {
                    let { product, cantidad } = carrito[key][i]
                    resultado += `<li>${product._id} - ${cantidad}</li>`
                }
                resultado += '</ul>'
                continue
            }
            if (key == '__v') break
            resultado += ' - ' + carrito[key]
        }
        resultado += '</li>'
    }
    console.log(`DOM update for ${socket.id}`)
    document.getElementById("cartList").innerHTML = resultado
})
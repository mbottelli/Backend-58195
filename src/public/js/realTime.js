const socket = io()

// async function traeLista() {
//     return await fetch('http://localhost:8080/api/products')
//         .then((response)=>response.json())
//         .then((responseJson)=>{return responseJson})
// }
// async function builder() {
//     const productos = await this.traeLista()
//     let resultado = ''
//     for (let i = 0; i < productos.length; i++) {
//         const producto = productos[i];
//         let { id, title, description, price, thumbnail, code, status } = producto
//         resultado = resultado + `<li>${id} - ${title} - ${description} - ${price} - ${thumbnail} - ${code} - ${status}</li>`
//     }
//     document.getElementById("productList").innerHTML = resultado
// }

// window.onload = builder()

socket.emit('prodRequest', 'solicitud emitida')

socket.on('prodUpdate', ()=>{
    socket.emit('prodRequest', 'solicitud emitida')
})

socket.on('prodResponse', (productos)=>{
    let resultado = ''
    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        let { id, title, description, price, thumbnail, code, status } = producto
        resultado = resultado + `<li>${id} - ${title} - ${description} - ${price} - ${thumbnail} - ${code} - ${status}</li>`
    }
    console.log(`DOM update for ${socket.id}`)
    document.getElementById("productList").innerHTML = resultado
})
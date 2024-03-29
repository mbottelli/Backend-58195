const socket = io()

socket.emit('prodRequest', 'solicitud emitida')

socket.on('prodUpdate', ()=>{
    socket.emit('prodRequest', 'solicitud emitida')
})

socket.on('prodResponse', (productos)=>{
    let resultado = ''
    for (let i = 0; i < productos.length; i++) {
        resultado += '<li>'
        const producto = productos[i];
        for (var key in producto){
            resultado += ' - ' + producto[key]
        }
        resultado += '</li>'
    }
    console.log(`DOM update for ${socket.id}`)
    document.getElementById("productList").innerHTML = resultado
})
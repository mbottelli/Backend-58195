const express = require('express');
const handlebars = require('express-handlebars')
const { createServer } = require('http')
const { Server } = require('socket.io')
const app = express();
const httpServer = createServer(app)
const io = new Server(httpServer)

const productsRouter = require('./routes/products.router')
const cartRouter = require('./routes/cart.router')
const viewsRouter = require('./routes/views.router')

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/', viewsRouter)
app.use('/api/products/', productsRouter)
app.use('/api/carts/', cartRouter)

app.use(express.static(`${__dirname}/public`))

app.engine('handlebars',handlebars.engine())
app.set('views',`${__dirname}/views`)
app.set('view engine','handlebars')

app.set('io', io) // La linea magica que me deja acceder a la instancia de io desde los routers

io.on('connection', (socket)=>{
    console.log('connected ' + socket.id)

    socket.on('prodRequest', async ()=>{
        let productos = ''
        await fetch('http://localhost:8080/api/products')
            .then((response)=>response.json())
            .then((responseJson)=>{productos = responseJson})
        socket.emit('prodResponse', productos)
    })

    socket.on('message', (message)=>{
        console.log(message)
        socket.emit('message', 'Hello from the server')
    })

    socket.on('disconnect',()=>{
        console.log(`socket ${socket.id} disconnected`)
    })
})

httpServer.listen(8080, ()=>console.log('Server up on port 8080'))
const products = require('./ProductManager')
const express = require('express');
const app = express();
const manager = new products('./test.json');

app.use(express.urlencoded({extended:true}));

app.get('/products', (req, res) =>{
    
    let producto = manager.getProducts();
    const limit = req.query.limit;

    if(limit){
        producto.splice(limit, producto.length)
    };

    res.send(producto);
});

app.get('/products/:ProductId', (req, res) =>{
    
    const id = Number(req.params.ProductId);
    let producto = manager.getProductById(id);

    if (!producto){
        res.status(404).send('El producto solicitado no existe');
    }

    res.send(producto);
})

app.listen(8080, ()=>console.log('Server up on port 8080'));
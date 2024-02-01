const { Router } = require('express');
const router = Router();

const products = require('../ProductManager')
const manager = new products(__dirname+'/../files/', 'productos.json');

router.get('/', (req, res) =>{
    let producto = manager.getProducts();
    const limit = req.query.limit;
    if(limit){
        producto.splice(limit, producto.length)
    };
    res.send(producto);
});

router.post('/', (req, res) =>{
    if (manager.addProduct(req.body) === true) {
        res.send({status:'Success'})
    } else {
        res.status(404).send({status:'Error'})
    }
})

router.get('/:ProductId', (req, res) =>{
    const id = Number(req.params.ProductId);
    let producto = manager.getProductById(id);
    if (!producto){
        res.status(404).send({status:'Producto no existe'});
        return;
    }
    res.send(producto);
})

router.put('/:ProductId', (req,res) =>{
    const id = Number(req.params.ProductId);
    if (manager.updateProduct(id, req.body) === true) {
        res.send({status:'Success'})
    } else {
        res.status(404).send({status:'Error'})
    }
})

router.delete('/:ProductId', (req,res) =>{
    const id = Number(req.params.ProductId);
    if (manager.deleteProduct(id) === true) {
        res.send({status:'Success'})
    } else {
        res.status(404).send({status:'Error'})
    }
})

module.exports = router;
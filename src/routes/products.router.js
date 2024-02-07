const { Router } = require('express');
const router = Router();

const products = require('../ProductManager')
const manager = new products(__dirname+'/../files/', 'productos.json');

let reqResponse


router.get('/', (req, res) =>{
    reqResponse = manager.getProducts();
    const limit = req.query.limit;
    if(limit){
        reqResponse.splice(limit, reqResponse.length)
    };
    res.send(reqResponse);
});

router.post('/', (req, res) =>{
    const io = req.app.get('io')
    reqResponse = manager.addProduct(req.body)
    io.emit('prodUpdate')
    res.status(reqResponse.code).send(reqResponse)
})

router.get('/:ProductId', (req, res) =>{
    const id = Number(req.params.ProductId);
    reqResponse = manager.getProductById(id);
    if ('code' in reqResponse){
        res.status(reqResponse.code).send(reqResponse);
    } else {
        res.send(reqResponse);
    }
})

router.put('/:ProductId', (req,res) =>{
    const io = req.app.get('io')
    const id = Number(req.params.ProductId);
    reqResponse = manager.updateProduct(id, req.body)
    io.emit('prodUpdate')
    res.status(reqResponse.code).send(reqResponse)
})

router.delete('/:ProductId', (req,res) =>{
    const io = req.app.get('io')
    const id = Number(req.params.ProductId);
    reqResponse = manager.deleteProduct(id)
    io.emit('prodUpdate')
    res.status(reqResponse.code).send(reqResponse)
})

module.exports = router;
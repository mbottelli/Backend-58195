const { Router } = require('express');
const router = Router();

const products = require('../dao/dbManagers/ProductManager')
const manager = new products()

let reqResponse

router.get('/', async (req, res) => {
    reqResponse = await manager.getProducts(req.query.limit,req.query.page,req.query.sort,req.query.query)
    res.send(reqResponse);
});

router.post('/', async (req, res) =>{
    const io = req.app.get('io')
    reqResponse = await manager.addProduct(req.body)
    io.emit('prodUpdate')
    res.status(reqResponse.code).send(reqResponse)
})

router.get('/:ProductId', async (req, res) =>{
    const id = req.params.ProductId;
    reqResponse = await manager.getProductById(id);
    if ('message' in reqResponse){
        res.status(reqResponse.code).send(reqResponse);
    } else {
        res.send(reqResponse);
    }
})

router.put('/:ProductId', async (req,res) =>{
    const io = req.app.get('io')
    const id = req.params.ProductId;
    reqResponse = await manager.updateProduct(id, req.body)
    io.emit('prodUpdate')
    res.status(reqResponse.code).send(reqResponse)
})

router.delete('/:ProductId', async (req,res) =>{
    const io = req.app.get('io')
    const id = req.params.ProductId;
    reqResponse = await manager.deleteProduct(id)
    io.emit('prodUpdate')
    res.status(reqResponse.code).send(reqResponse)
})

module.exports = router;
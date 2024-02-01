const { Router } = require('express');
const router = Router();

const carts = require('../CartManager')
const manager = new carts(__dirname+'/../files');

router.post('/', (req, res) =>{
    manager.addCart();
    res.send({status: 'Success'})
})

router.get('/:cid', (req, res) =>{
    const id = Number(req.params.cid)
    let carrito = manager.getCart(id)
    if (!carrito){
        res.status(404).send({status:'Carrito no existe'})
        return
    }
    res.send(carrito)
})

router.post('/:cid/products/:pid', (req, res) =>{
    const cid = Number(req.params.cid)
    const pid = Number(req.params.pid)
    if (manager.addProduct(cid, pid, 1) === true) {
        res.send({status: 'Success'})
    } else {
        res.status(404).send({status:'Error'})
    }
})

module.exports = router;
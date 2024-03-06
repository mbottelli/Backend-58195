const { Router } = require('express');
const router = Router();
const mongoose = require('mongoose')

const carts = require('../dao/dbManagers/CartManager')
const manager = new carts();

let reqResponse

router.post('/', async (req,res) =>{
    const io = req.app.get('io')
    reqResponse = await manager.addCart();
    io.emit('cartUpdate')
    res.status(reqResponse.code).send(reqResponse)
})

// Hecho para debugear
router.get('/all', async (req,res) =>{
    reqResponse = await manager.getAllCarts()
    res.send(reqResponse)
})

router.get('/:cid', async (req,res) =>{
    const id = req.params.cid
    reqResponse = await manager.getCart(id)
    if ('message' in reqResponse){
    res.status(reqResponse.code).send(reqResponse)
    } else {
        res.send(reqResponse)
    }
})

router.put('/:cid', async(req,res) =>{
    const io = req.app.get('io')
    const cid =  new mongoose.Types.ObjectId(req.params.cid)
    reqResponse = await manager.updateCart(cid, req.body)
    io.emit('cartUpdate')
    res.send(reqResponse)
})

router.delete('/:cid', async(req,res) =>{
    const io = req.app.get('io')
    const cid =  new mongoose.Types.ObjectId(req.params.cid)
    reqResponse = await manager.deleteCart(cid)
    io.emit('cartUpdate')
    res.send(reqResponse)
})

router.post('/:cid/products/:pid', async (req,res) =>{
    const io = req.app.get('io')
    const cid =  new mongoose.Types.ObjectId(req.params.cid)
    const pid =  new mongoose.Types.ObjectId(req.params.pid)
    reqResponse = await manager.addProduct(cid,pid,1)
    io.emit('cartUpdate')
    res.status(reqResponse.code).send(reqResponse)
})

router.put('/:cid/products/:pid', async (req,res) => {
    const io = req.app.get('io')
    const cid =  new mongoose.Types.ObjectId(req.params.cid)
    const pid =  new mongoose.Types.ObjectId(req.params.pid)
    reqResponse = await manager.updateProduct(cid,pid,req.body)
    io.emit('cartUpdate')
    res.status(reqResponse.code).send(reqResponse)
})

router.delete('/:cid/products/:pid', async(req,res) =>{
    const io = req.app.get('io')
    const cid =  new mongoose.Types.ObjectId(req.params.cid)
    const pid =  new mongoose.Types.ObjectId(req.params.pid)
    reqResponse = await manager.deleteProduct(cid,pid)
    io.emit('cartUpdate')
    res.send(reqResponse)
})

module.exports = router;
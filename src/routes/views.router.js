const {Router} = require('express')

const router = Router()


router.get('/',(req,res)=>{
    res.render('home',{})
})

router.get('/realtimeproducts', (req,res)=>{
    res.render('realtimeproducts',{})
})

router.get('/debug', (req,res)=>{
    res.render('debug',{})
})

router.get('/chat', (req,res)=>{
    res.render('chat',{})
})

router.get('/products', (req,res)=>{
    res.render('products',{})
})
module.exports = router;
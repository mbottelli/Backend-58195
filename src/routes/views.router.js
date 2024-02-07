const {Router} = require('express')

const router = Router()


router.get('/',(req,res)=>{
    res.render('home',{})
})

router.get('/realtimeproducts', (req,res)=>{
    res.render('realtimeproducts',{})
})


module.exports = router;
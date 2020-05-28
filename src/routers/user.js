const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/User') 
const auth = require('../middleware/auth')
const Task = require('../models/Task')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/acount')
const router = express.Router()

// router.get('/test', (req,res)=>{
//     res.send('hey from router')
// })

// create new user
router.post('/users',async (req, res)=>{
    user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)

        const token = await user.generateAuthToken()
        
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }

    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // })

})


router.post('/users/login', async (req, res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({ user, token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout', auth, async (req, res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token != req.token)

        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/logoutall', auth, async (req, res)=>{
    try {
        req.user.tokens = []

        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/users/me', auth, async (req,res)=>{
    res.send(req.user)
    
    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // }catch(e){
    //     res.status(500).send()
    // }


    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((error)=>{
    //     res.status(500).send()
    // })
})



router.get('/users/:id',async (req,res)=>{
    const _id = req.params.id

    // promises with async and await
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        //console.log(e)
        res.status(500).send()
    }

    // promises with then and catch

    // User.findById(_id).then((user)=>{
    //     // if(!user)
    //     //     return res.status(404).send()   
    //     res.send(user)
    // }).catch((error)=>{
    //     res.status(500).send()
    // })
})
 

router.patch('/users/me', auth, async (req,res)=>{
    // const _id = req.params._id
    const updates = Object.keys(req.body)
    const availableUpates = ['name', 'age', 'email', 'password']
    const isValid = updates.every((update)=> availableUpates.includes(update))
    

    if(!isValid){
        return res.status(400).send({error: "Invalid updates"})
    }
    
    try {
        // const user = await User.findById(_id)
        const user = req.user

        updates.forEach((update)=> user[update] = req.body[update])

        await user.save()
        // const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})

        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async(req, res)=>{
    try {
        // const user = await User.findOneAndDelete({_id: req.user._id})
        // await req.user.remove()
        console.log('bef')
        await Task.deleteMany({ owner: req.user._id})
        await User.deleteOne({_id: req.user._id})
        sendCancelationEmail(req.user.email, req.user.name)
        console.log('af')
        res.send(req.user)
    } catch (error) {
        res.status(500).send({ ...error , err:'hello'}) 
    }
})

const upload = multer({
    // dest:'avatars',
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpe?g|png)$/)){
            return cb(new Error('Please upload image with one of these extensions (.png, .jpg, .jpeg)!!'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{

    const buffer = await sharp(req.file.buffer).resize({ width:250, height:250 }).png().toBuffer()

    req.user.avatar = buffer
    
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})
// 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

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        
        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (error) {
        res.status(404).send()
    }
})
module.exports = router
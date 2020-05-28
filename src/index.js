const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT 




const multer = require('multer')

const upload = multer({
    dest: 'images',
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.docx?$/)){
            return cb(new Error('Please upload document!'))
        }
        cb(undefined, true)
        // cb(new Error('error message'))
        // cb(undefined, true)
    }
})
const errorMiddleware = (req, res, next)=>{
    throw new Error('midware error')
}
// upload.single('upload')

app.post('/upload', upload.single('upload'), (req, res)=>{
    try{
        res.send()
    } catch(e) {
        res.status(403).send(e)
    }
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message })
})

// middleware (Express)
    
// app.use((req, res, next)=>{
//     res.status(503).send('we\'re sorry the server is under maintenance come back soon')
// })

// app.use((req, res, next) => {
//     if(req.method === 'GET'){
//         res.send('it\'s not allowed !')
//     }else {
//         next()
//     }
    
//     // console.log(req.method, req.path)
    
//     // next()
// })




app.use(express.json())

app.use(userRouter)
app.use(taskRouter)



app.listen(port, ()=>{
    console.log('Server is up on port: ',port)
})


const Task = require('./models/Task')
const User = require('./models/User')





// const main = async ()=>{
//     // const task = await Task.findById('5ebe51948fd27c55fe248761')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     // const tasks = await Task.find({owner:'5ebe503dcdfdac543894b73d'})
//     // console.log(tasks)

//     const user = await User.findById('5ebe503dcdfdac543894b73d')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)

// }

// main()




// const pet = {
//     name: 'Meo'
// }

// console.log(JSON.stringify(pet))



// const jwt = require('jsonwebtoken')
// const myFunc = async()=>{
//     const authenticationToken = jwt.sign({ id: 'asdsa' }, 'thisismynewtoken', {expiresIn: '7 days'})
//     console.log(authenticationToken)
//     const data = jwt.verify(authenticationToken, 'thisismynewtoken')
//     console.log(data)
// }

// myFunc()



// const bcrypt = require('bcryptjs')

// const myFunc = async ()=>{
//     const password = 'Red12345!'
//     try {
//         const hashedPassword = await bcrypt.hash(password, 8)
//         console.log(password)
//         console.log(hashedPassword)
//         //$2a$08$PCMDZC.DcAGdCt.ibZaP3OJms/LGK4DUcbnibi0jFTN/yprTmBk..
//         //$2a$08$Tc9KdgZDjytVBUDrj.hJ7eCGzqedcwmraUx0sqhJDeNuzfLkQo65y
//         console.log( await bcrypt.compare('Red12345!','$2a$08$PCMDZC.DcAGdCt.ibZaP3OJms/LGK4DUcbnibi0jFTN/yprTmBk..'))
//     } catch (error) {
        
//     }

// }

// myFunc()
const mongoose = require('mongoose')

// const connectionURL = 'mongodb://127.0.0.1:27017/task-manager-api'

// mongocluster-user:: user: taskapp password: taskapp-password

const connectionURL = process.env.MONGODB_URL 

mongoose.connect(connectionURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex:true,
    useFindAndModify:false
})

// const User = mongoose.model('User',{
//     name:{
//         type: String,
//         trim: true,
//         required: true 
//     },age:{
//         type: Number,
//         default: 0,
//         validate(value){
//             if(value < 0){
//                 throw new Error('age must be a positive number')
//             }
//         }
//     },email:{
//         type: String,
//         required: true,
//         lowercase: true,
//         trim:true , 
//         validate(value){
//             if(!validator.isEmail(value))
//                 throw new Error('email invalid')
//         }
//     },password:{
//         type: String,
//         required:true,
//         minlength: 6,
//         trim:true,
//         validate(value){
//             if (value.toLowerCase().includes('password')) {
//                 throw new Error("it's a week password")
//             }
//         }
//     }
// })

// const me = new User({
//     name: '  Mahmoud Badr',
//     email:'mbadr1210@gmail.com',
//     password:'mh57885788'
// })
// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('Error!', error)
// })

// const Task = mongoose.model('Task',{
//     description:{
//         type: String,
//         required: true,
//         trim: true
//     },completed:{
//         type: Boolean,
//         default: false
//     }
// })

// const myTask = new Task({description:' Eat!'})//{description: "starting spring study", completed: false})
// myTask.save().then(()=>{
//     console.log(myTask)
// }).catch((error)=>{
//     console.log('Error!', error)
// })


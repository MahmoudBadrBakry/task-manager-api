const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true 
    },age:{
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('age must be a positive number')
            }
        }
    },email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true , 
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('email invalid')
        }
    },password:{
        type: String,
        required:true,
        minlength: 6,
        trim:true,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error("it's a week password")
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true 
        }
    }],
    avatar:{
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref:'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function(){
    const user = this

    // const token = jwt.sign({ _id: user._id.toString() }, 'mylittlesecrethehe') 
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET) 

    user.tokens = user.tokens.concat({ token })
    await user.save()
    
    return token
}

userSchema.methods.toJSON = function(){
    const user = this

    const userObject =  user.toObject()
    
    delete userObject.password
    delete userObject.tokens 
    delete userObject.avatar 
    
    return userObject
}

userSchema.statics.findByCredentials = async (email, password)=>{
    const user = await User.findOne({ email })
    if(!user) {
        // console.log(1)
        throw new Error('Unable tot login')
    } 
    
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) {
        // console.log(2)
        throw new Error('Unable to login')
    } 

    return user
}   

// hash the plain text password
userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    // console.log(user, 'just before saving')
    next()
})

// userSchema.pre('', async function(next) {
//     const user = this   
//     console.log(haha)
//     await Task.deleteMany({ owner: user._id })
//     next()
// })

const User = mongoose.model('User', userSchema)

module.exports = User
const jwt = require('jsonwebtoken')
const User = require('../models/User')


const auth = async (req, res, next)=>{
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        // const decoded = jwt.verify(token, 'mylittlesecrethehe')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token })

        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user

        next()
        // console.log(token)
        //console.log(req.req.rawHeaders)

    } catch (error) {
        res.status(401).send({error: "please authenticate."})
    }
    
    // console.log('mid is running')
    // next()
}

module.exports = auth
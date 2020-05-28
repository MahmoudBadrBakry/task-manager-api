
const sgMail = require('@sendgrid/mail') 

// const sendgridAPIKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(process.env.SENDGRID_API_KEY)



// sgMail.setTwilioEmailAuth('mbadr1210','password')
// sgMail.send(msg).then(()=>{
//    console.log('done') 
// }).catch((error)=>{
//     console.log(error) 
// })

const sendWelcomeEmail = async (email, name) => {
    const msg = {
    to: email,
    from: 'mbadr1210@gmail.com',
    subject: 'thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app. `,
    }
    try {
        await sgMail.send(msg);
        console.log('welcomming sent!')
    } catch (error) {
        
        if (error.response) {
            console.log(error.response.body)
        } else {

            console.error(error);
        }
    }
}

const sendCancelationEmail = async (email, name) => {
    const msg = {
    to: email,
    from: 'mbadr1210@gmail.com',
    subject: 'we were pleased to serve you!',
    text: `hi, ${name}. Let us know why are you cancelling your account and tell us if we can do anything to improve our app.`,
    }

    try {
        await sgMail.send(msg);
        console.log('cancelling sent!')
    } catch (error) {
        
        if (error.response) {
            console.log(error.response.body)
        } else {

            console.error(error);
        }
    }
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}

// sendWelcomeEmail()

// sgMail.send({
//     to: 'mbadr1210@gmail.com',
//     from: 'mbadr1210@gmail.com',
//     subject: 'this is my first sendgrid email',
//     text: 'I hope this one is actually get to you.'
// }).then(()=>{
//    console.log('done') 
// }).catch((error)=>{
//     console.log(error) 
// })
const nodemailer = require('nodemailer');
//for sending mail
const sendEmail = options =>{
    //1 create a transporter(object):- this is a service to send email
    const transporter = nodemailer.createTransport({
        //here we need some options
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
     auht:{
         user:process.env.EMAIL_USERNAME,
         pass:process.env.EMAIL_PASSWORD
     }
     //activate in gmail "less secure app" optin
    });

    //2) Define the email Options
    const mailOptions ={
        from:'Anant Raj   <user1@r.com>',
        //receipnt add.
        to: option.email,
        subject: option.subject,
        text: option.message,
        //converting message to html
        // html:
    };
    //3) Actually sending the email t return a promise 
  await transporter.sendMail(mailOptions)
};

module.exports = sendEmail;
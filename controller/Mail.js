

const nodemailer = require('nodemailer');
const {template} = require("../utils/TokenVerificationTemplate.js")
// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service : 'gmail',
    host: "smtp.ethereal.email",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: "naresh.kumawat159924@gmail.com",
      pass: "jngi gkiw iofj ucwi",
    },
  });

// Set up email data



const sendverificationMail = (mailId,token)=>{
    console.log(mailId)
    const link = `<a href="http://localhost:3000/AuthHome/verfiy?email=${mailId}&otp=${token}">http://localhost:3000/verfiy</a>`

    const mailOptions = {
      from: 'naresh.kumawat159924@gmail.com', // Sender address
      to: mailId,  // List of recipients
      subject: 'Verfication Token Mail', // Subject line
      html: template.replace(/{Link}/g, link) // HTML body
  };
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error occurred:', error);
    }
    console.log('Email sent successfully:', info.response);
});
}

const sendResetPasswordMail = (mailId,token)=>{
  const link = `<a href="http://localhost:3000/ResetPasswordVerfiy?email=${mailId}&otp=${token}">http://localhost:3000/verfiy</a>`

  const mailOptions = {
    from: 'naresh.kumawat159924@gmail.com', // Sender address
    to: mailId,  // List of recipients
    subject: 'Verfication Token Mail', // Subject line
    html: template.replace(/{Link}/g, link) // HTML body
};
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
      return console.log('Error occurred:', error);
  }
  console.log('Email sent successfully:', info.response);
});
}



module.exports = {sendverificationMail,sendResetPasswordMail}
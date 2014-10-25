var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    greetingTimeout: 60000,
    host: "smtp.gmail.com",
    debug: true,
    secure: false,
    service: 'Gmail',
    auth: {
        user: 'jethroestrada23@gmail.com',
        pass: 'michylkas237'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Jethro Estrada <jethroestrada23@gmail.com>', // sender address
    to: 'jethro.estrada@yahoo.com', // list of receivers
    subject: 'Hello', // Subject line
    text: 'Hello world ', // plaintext body
    html: '<b>Hello world </b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});
const { Router } = require('express');
const { check } = require('express-validator');


const router = Router();

router.post("/sendmail", (req, res) => {
    console.log("request came");
    let user = req.body;
    sendMail(user, info => {
        console.log(`The mail has beed send 😃 and the id is ${info.messageId}`);
        res.send(info);
    });
});

async function sendMail(user, callback) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: details.email,
            pass: details.password
        }
    });

    let mailOptions = {
        from: '"Fun Of Heuristic"<example.gimail.com>', // sender address
        to: user.email, // list of receivers
        subject: "Wellcome to Fun Of Heuristic 👻", // Subject line
        html: `<h1>Hi ${user.name}</h1><br>
      <h4>Thanks for joining us</h4>`
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    callback(info);
}

module.exports = router;
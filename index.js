require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('isomorphic-fetch');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

const port = 4444;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.listen(port, () => {
  // console.log('We are live on port 4444');
});

app.get('/', (req, res) => {
  res.send('Nothing to see here! :)');
});

const handleSend = async (req, res) => {
  const secret_key = process.env.SECRET_KEY;
  const { token } = req.body;

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

  console.log(url);

  await fetch(url, {
    method: 'post',
  })
    .then((response) => response.json())
    .then((google_response) => res.json({ google_response }))
    .catch((error) => res.json({ error }));
};

app.post(
  '/api/checkcaptcha',
  handleSend
); /* (req, res) => {
  const recaptchaCheck = JSON.stringify({
    body: {
      secret: process.env.REACT_APP_reCAPTCHA_site_key,
      response: req.token,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-Requested-With',
    },
  });
  console.log(req.body);

  /* app
    .post('https://www.google.com/recaptcha/api/siteverify', recaptchaCheck)
    .then(() => {
      console.log(`statusCode: ${res.statusCode}`);
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
}); */

app.post('/api/v1', (req, res) => {
  const data = req.body;

  // console.log(data);
  // DONE verify which site the front is calling to get the token
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
    auth: {
      user: process.env.GMAIL_username,
      pass: process.env.GMAIL_pass,
    },
  });

  const mailOptions = {
    from: data.email,
    to: process.env.EMAIL_address,
    subject: 'Contato recebido via formulário do site',
    attachments: [
      {
        filename: 'logo_black_dprot.png',
        path: `${__dirname}/images/logo_black_dprot.png`,
        cid: 'logo_dussou_black_dprot',
      },
    ],
    html: `<div id="message" style="width:600px;font-size:14px;margin-top:0;margin-bottom:0;margin-right:auto;margin-left:auto;text-align:center;border-width:1px;border-style:solid;border-color:#ccc;border-radius:6px;font-family:'Roboto', sans-serif;color:#333;font-weight:300;" >
    <div id="container" style="padding-top:15px;padding-bottom:15px;padding-right:15px;padding-left:15px;" >
      <table id="head" style="line-height:2;margin-top:15px;margin-bottom:15px;margin-right:15px;margin-left:15px;" >
        <tr>
          <td id="logo_cont"><img id="logo" src="cid:logo_dussou_black_dprot" alt="Logo Dussou" style="height:70px;" /> </td>

          <td id="message_title">
            <h2 style="margin-left:15px;font-family:'Roboto', sans-serif;font-size:22px;font-weight:500;margin-top:auto;margin-bottom:auto;" > Contato recebido pelo site:</h2>
          </td>

        </tr>
      </table>
      <hr style="height:1px;background-color:#555;background-image:none;background-repeat:repeat;background-position:top left;background-attachment:scroll;margin-left:15px;margin-right:15px;" >
      <div id="content" style="margin-top:15px;margin-bottom:15px;margin-right:15px;margin-left:15px;text-align:justify;" >
        <p id="name" style="line-height:1.2;margin-top:10px;" ><strong style="font-weight:600;" >Nome: </strong> ${data.name}</p>
        <p id="company" style="line-height:1.2;margin-top:10px;" ><strong style="font-weight:600;" >Empresa: </strong>${data.company}</p>
        <p id="email" style="line-height:1.2;margin-top:10px;" ><strong style="font-weight:600;" >Endereço de e-mail: </strong>${data.email}</p>
        <p id="phone" style="line-height:1.2;margin-top:10px;" ><strong style="font-weight:600;" >Telefone: </strong>${data.phone}</p>
        <p id="message_text" style="line-height:1.2;margin-top:10px;" ><strong style="font-weight:600;" >Mensagem: </strong></p>
        <p style="line-height:1.2;margin-top:10px;" >${data.message}</p>
      </div>
    </div>
  </div>
  <div id="foot" style="padding-top:10px;text-align:center;font-size:10px;" >Essa é uma mensagem automática. Não responda a este e-mail. | &copy;2020 Dussou Proteções Eletrônicas</div>`,
  };

  // console.log(process.env.GMAIL_username);
  smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      res.send(error);
      // console.log(`${error}`);
    } else {
      res.send({ result: 'Success' });
      // console.log(response.body);
    }
    smtpTransport.close();
  });
});

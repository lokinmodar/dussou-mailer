const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

const port = 4444;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.listen(port, () => {
  console.log('We are live on port 4444');
});


app.get('/', (req, res) => {
  res.send('Welcome to my api');
})

app.post('/api/v1', (req,res) => {
  var data = req.body;

var smtpTransport = nodemailer.createTransport({
  service: 'Gmail',
  port: 465,
  auth: {
    user: 'dussouprotecoes',
    pass: 'du$$$oumd'
  }
});

var mailOptions = {
  from: data.email,
  to: 'dussouprotecoes@gmail.com',
  subject: 'Contato via formulário do site',
  html: `<p>Contato: ${data.name}</p>
          <p>Endereço de e-mail: ${data.email}</p>
          <p>Mensagem: ${data.message}</p>`
};

smtpTransport.sendMail(mailOptions,
(error, response) => {
  if(error) {
    res.send(error)
    console.log("erro" + error)
  }else {
    res.send({ result: 'Success' })
    console.log(response.body)
  }
  smtpTransport.close();
});

})

const mysql = require('mysql');
const process = require('process');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'zeroedprogrammer@gmail.com',
    pass: 'your_password'
  }
}));

const pid = process.pid;

console.log('pid: ',pid);

const cuerpo = 'Laboris eiusmod dolor nostrud mollit ipsum ea incididunt labore sunt ad eu.'
send_email(cuerpo)

function send_email(data){
  setTimeout(() => {
    console.log('Email enviado...');
      let content_text = data

      let content_html = `<!DOCTYPE html>
      <html lang="en" dir="ltr">
        <head>
          <meta charset="utf-8">
          <title></title>
          <style type="text/css" media="screen">
            div.table{
              border: solid 1px #CCC;
            }
            div.table div.head{
            }
            div.table div.cell_head{
              background: #63c;
              color:#fff;
              line-height:1.5em;
              float:left;
              padding: 0 10px 0 10px;
              width: 5em;
            }
            div.table div.cell_row{
              line-height:1.5em;
              padding: 0 10px 0 10px;
            }
          </style>
        </head>
        <body>
          <div class="table">
            <div class="head">
              <div class="cell_head">Cuerpo:</div><div class="cell_row">${data}</div>
            </div>
          </div>
        </body>
      </html>`;

      let mailOptions = {
        from: 'zeroedprogrammer@gmail.com',
        to: 'edwin.arroyo@estratek.com.co',
        subject: 'test message',
        text: content_text,
        html: content_html
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });


  },10000)
}

/*
  ¿Cómo controlo la pérdida de conexión con la database?
  reejecutar script??

*/

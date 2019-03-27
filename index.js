const mysql = require('mysql');
const process = require('process');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "abcd1234",
  database: "bitnami_pm",
  port: 3306
});

const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'zeroedprogrammer@gmail.com',
    pass: '@zeroedprogrammer'
  }
}));

const pid = process.pid;
initialState().then((actualId) =>{
  bucle(actualId);
});

async function bucle(actualId){

    console.log('id: ',actualId);
    console.log('pid: ',pid);

     let lastid = await checkIfNewRecordHasBeenAdd(actualId);

      if(lastid>actualId){
        console.log('Nueva inserción...');
        setTimeout(() => {
          bucle(lastid);
        },6000)

      }else{
        console.log('No ha cambiado...');
        setTimeout(() => {
          bucle(actualId);
        },6000)
      }
}

async function initialState(){
  return await lastId();
}

function lastId(){
  return new Promise( resolve =>{
    con.query('SELECT MAX(idAlerta) as lastId FROM alertasInformacion;',
      (err, rows) => {
        if(err) throw err;
         resolve(rows[0].lastId);
        // con.end(); /* close connection */
      }
    );
  })
}

function checkIfNewRecordHasBeenAdd(id){
  return new Promise( resolve => {
    con.query('SELECT idAlerta,dsAlerta, DATE_FORMAT(feAlerta,"%Y-%m-%d %r") as feAlerta FROM alertasInformacion WHERE idAlerta > ?', [id],
      function (err, rows) {
        try {
          if(rows.length>0){ /* New insert => email logic */
            send_email(rows);
            resolve(rows[rows.length-1].idAlerta)
          }else{
            resolve(id);
          }
        } catch (e) {
          console.error(e);
        } finally {
          resolve(id);
        }
      }
    );
  })
}

function send_email(data){
  setTimeout(() => {
    console.log('Email enviado...');
      let r = data[data.length-1];
      let content_text = 'id: ' + r.idAlerta + ' ds: '+  r.dsAlerta+ ' fecha: '+  r.feAlerta;

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
              <div class="cell_head">Id alert:</div><div class="cell_row">${r.idAlerta}</div>
              <div class="cell_head">Ds alert:</div><div class="cell_row">${r.dsAlerta}</div>
              <div class="cell_head">Fecha:</div><div class="cell_row">${r.feAlerta}</div>
            </div>
          </div>
        </body>
      </html>`;

      let mailOptions = {
        from: 'zeroedprogrammer@gmail.com',
        to: 'edwin.arroyo@landsoft.com.co',
        subject: 'Alert - '+r.idAlerta,
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

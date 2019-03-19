const mysql = require('mysql');
const process = require('process');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "abcd1234",
  database: "bitnami_pm",
  port: 3307
});

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
    con.query('SELECT * FROM alertasInformacion WHERE idAlerta > ?', [id],
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
  },10000)
}

/*
  ¿Cómo controlo la pérdida de conexión con la database?
  reejecutar script??

*/

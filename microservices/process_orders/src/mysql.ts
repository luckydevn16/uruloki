import fs from 'fs';
import mysql from'mysql';

export var connection = mysql.createConnection({
  host     : 'aws.connect.psdb.cloud',
  user     : '45iqlm5zvzewnwlngso5',
  password : 'pscale_pw_Dnn8HNyC4E2sgmRQIGxbckZyf2rZnx48oV9h0gXt3RK',
  database : 'project-zenith',
  ssl: {
    ca: fs.readFileSync('/etc/ssl/certs/ca-certificates.crt')
  }
});

export const dbconnect = async () => {
      connection.connect();
      console.log("DB connected");
} 
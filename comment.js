const mysql = require("mysql");
const con = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  database: process.env.RDS_DATABASE,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
});

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const { name } = event;
  const content = event.content;
  const createdatetime = String(new Date().getTime());

  if (!name || !content) {
    callback(null, {
      statusCode: 400,
      body: "params error",
    });
    return;
  }

  const q =
    "insert into comment (name, content, createdatetime) values (?,?,?)";
  const values = [name, content, createdatetime];
  con.query(q, values, function (err, result) {
    if (err) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(err),
      });
    } else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(result),
      });
    }
  });
};

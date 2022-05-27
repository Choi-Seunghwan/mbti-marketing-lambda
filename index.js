const mysql = require("mysql");
const con = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DATABASE,
  port: process.env.RDS_PORT,
});

exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const cursor = Number(event?.queryStringParameters?.cursor) || 0;
  const size = Number(event?.queryStringParameters?.size) || 10;

  const q =
    "select * from comment order by id desc limit " +
    String(cursor * size) +
    ", " +
    String(size + cursor * size);

  con.query(q, function (err, result) {
    if (err) {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify(result),
      });
    } else {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(result),
      });
    }
  });
};

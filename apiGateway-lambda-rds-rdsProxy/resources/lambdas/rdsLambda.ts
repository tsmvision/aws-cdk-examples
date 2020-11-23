import * as AWS from "aws-sdk";
// mysql2 with promise wrapper
import * as mysql from "mysql2/promise";
import * as fs from "fs";
import { APIGatewayProxyHandler } from "aws-lambda";
import * as path from "path";

AWS.config.update({ region: "us-east-1" });

const secretClient = new AWS.SecretsManager({
  region: "us-east-1",
});

export const handler: APIGatewayProxyHandler = async (event) => {
  //   console.log("request:", JSON.stringify(event, undefined, 2));
  //   console.log(`Getting secret for ${process.env.RDS_SECRET_NAME}`);
  //   // All requests get routed to this function, when opened via browser it looks for a favicon.
  //   if (event.rawPath === "/favicon.ico") {
  //     return sendRes(404, "no favicon here");
  //   }
  // retrieve the username and password for MySQL from secrets manager

  const secret = await secretClient
    .getSecretValue({
      SecretId: process.env.RDS_SECRET_NAME || "",
    })
    .promise();

  const { username = "", password = "" } = JSON.parse(
    secret.SecretString || ""
  );

  // Important to note that the ssl cert is not the standard RDS cert.
  // RDS certification such as rds-ca-201-root.pem or rds-combined-ca-bundle.pem not working - why???
  // https://www.amazontrust.com/repository/AmazonRootCA1.pem
  const connection = await mysql.createConnection({
    host: process.env.PROXY_ENDPOINT,
    user: username,
    password,
    ssl: {
      ca: fs.readFileSync(path.join(__dirname, "AmazonRootCA1.pem"), "utf-8"),
    },
  });

  // This may be our first time running this function, setup a MySQL Database
  try {
    const [rows, fields] = await connection.query(
      "CREATE DATABASE IF NOT EXISTS cdkpatterns"
    );
    // console.log(rows, fields);
    // console.log(`CREATE DATABASES query returned ${JSON.stringify(results)}`);
  } catch (error) {
    console.log(JSON.stringify(error));
  }

  // If this is our first execution, create our rds_proxy table inside cdkpatterns
  try {
    const [rows, fields] = await connection.query(
      "CREATE TABLE IF NOT EXISTS cdkpatterns.rds_proxy (id INT AUTO_INCREMENT PRIMARY KEY, url VARCHAR(20))"
    );
    // console.log(rows, fields);
  } catch (error) {
    console.log(JSON.stringify(error));
  }

  // Insert a new record with an auto generated ID and the url you hit on the API Gateway
  try {
    const [rows, fields] = await connection.query(
      `INSERT INTO cdkpatterns.rds_proxy(url) VALUES ('${event.path}')`
    );
    // console.log(rows, fields);
  } catch (error) {
    console.log(JSON.stringify(error));
  }

  // Query for all records in the DB and build up an HTML Table of results
  try {
    const [rows, fields] = await connection.query(
      `SELECT * FROM cdkpatterns.rds_proxy`
    );
    console.log(rows, fields);
  } catch (error) {
    console.log(JSON.stringify(error));
  }

  // disconnect database
  connection.destroy();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "database connection successful.",
    }),
  };
};

import * as AWS from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";

AWS.config.apiVersions = {
  dynamodb: "2012-08-10",
  // other service API versions
};

export const handler: APIGatewayProxyHandler = async () => {
  const dynamodb = new AWS.DynamoDB();

  const { TABLE_NAME = "" } = process.env;
  const params = {
    RequestItems: {
      [TABLE_NAME]: {
        Keys: [
          {
            pk: {
              S: "pk01",
            },
            sk: {
              S: "sk01",
            },
          },
          {
            pk: {
              S: "pk01",
            },
            sk: {
              S: "sk02",
            },
          },
        ],
      },
    },
  };

  try {
    const data = await dynamodb.batchGetItem(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data,
      }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "read items",
      }),
    };
  }
};

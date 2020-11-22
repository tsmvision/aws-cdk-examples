import * as AWS from "aws-sdk";
import { APIGatewayProxyHandler } from "aws-lambda";
import { IRequest, IDynamodbPutRequest, IParam } from "./writeItems.type";

// test input body
// [
//   {
//     pk: 'pk02',
//     sk: 'sk02',
//     message: 'alpha'
//   },
//   {
//     pk: 'pk03',
//     sk: 'sk03',
//     message: 'Beta'
//   },
//   {
//     pk: 'pk04',
//     sk: 'sk01',
//     message: 'Gamma'
//   },
// ]

/**
 * generate dynamodb params with request
 * @param request
 */
const generatePutRequests = (request: IRequest[]): IDynamodbPutRequest[] => {
  const result = [];

  for (let req of request) {
    result.push({
      PutRequest: {
        Item: {
          pk: {
            S: req.pk,
          },
          sk: {
            S: req.sk,
          },
          message: {
            S: req.message,
          },
        },
      },
    });
  }

  return result;
};

AWS.config.apiVersions = {
  dynamodb: "2012-08-10",
  // other service API versions
};

export const handler = async (event: any) => {
  const { body } = event;

  if (!body) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: "input values are not valid",
      }),
    };
  }

  const requests: IRequest[] = body;

  const dynamodb = new AWS.DynamoDB();

  const { TABLE_NAME = "" } = process.env;
  const params: IParam = {
    RequestItems: {
      [TABLE_NAME]: generatePutRequests(requests),
    },
  };

  try {
    const data = await dynamodb.batchWriteItem(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        data,
      }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error,
      }),
    };
  }
};

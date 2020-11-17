// reference:
// blog: https://www.alexdebrie.com/posts/lambda-custom-authorizers/
// https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
// https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html#api-gateway-lambda-authorizer-lambda-function-create
// export const handler = async (event: any) => {
//   // console.log(event);
//   // return {
//   //   statusCode: 200,
//   //   body: JSON.stringify({
//   //     message: "This is authorizer",
//   //   }),
//   // };
//   return
//   {JSON.stringify({
//     principalId: "luke", // The principal user identification associated with the token sent by the client.
//     policyDocument: {
//       Version: "2012-10-17",
//       Statement: [
//         {
//           Action: "execute-api:Invoke",
//           Effect: "Allow",
//           Resource:
//             "arn:aws:execute-api:us-east-1:183844933110:xqllqiylwi/*/GET/",
//         },
//       ],
//     },
//     context: {
//       org: "my-org",
//       role: "admin",
//       createdAt: "2019-01-03T12:15:42",
//     },
//   });
// }
// };

// A simple token-based authorizer example to demonstrate how to use an authorization token
// to allow or deny a request. In this example, the caller named 'user' is allowed to invoke
// a request if the client-supplied token value is 'allow'. The caller is not allowed to invoke
// the request if the token value is 'deny'. If the token value is 'unauthorized' or an empty
// string, the authorizer function returns an HTTP 401 status code. For any other token value,
// the authorizer returns an HTTP 500 status code.
// Note that token values are case-sensitive.

// A simple token-based authorizer example to demonstrate how to use an authorization token
// to allow or deny a request. In this example, the caller named 'user' is allowed to invoke
// a request if the client-supplied token value is 'allow'. The caller is not allowed to invoke
// the request if the token value is 'deny'. If the token value is 'unauthorized' or an empty
// string, the authorizer function returns an HTTP 401 status code. For any other token value,
// the authorizer returns an HTTP 500 status code.
// Note that token values are case-sensitive.

interface IEvent {
  authorizationToken: string;
  methodArn?: string;
}

exports.handler = async (event: IEvent) => {
  const token = event.authorizationToken;
  switch (token) {
    case "allow":
      return generatePolicy("user", "Allow", event.methodArn);
    case "deny":
      return generatePolicy("user", "Deny", event.methodArn);
    case "unauthorized":
      return "Unauthorized"; // Return a 401 Unauthorized response
    default:
      return "Error: Invalid token"; // Return a 500 Invalid token response
  }
};

interface IStatement {
  Action: string;
  Effect: string;
  Resource: string;
}

interface IAuthResponse {
  principalId: string;
  context: {
    stringKey: string;
    numberKey: number;
    booleanKey: boolean;
  };
  policyDocument?: {
    Version: string;
    Statement: IStatement[];
  };
}

type IGeneratePolicy = (
  principalId: string,
  effect?: string,
  resource?: string
) => IAuthResponse;

// Help function to generate an IAM policy
const generatePolicy: IGeneratePolicy = (principalId, effect, resource) => {
  const authResponse = {
    principalId,
    context: {
      stringKey: "stringval",
      numberKey: 123,
      booleanKey: true,
    },
  };

  if (effect && resource) {
    const policyDocument = {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    };
    // authResponse.policyDocument = policyDocument;
    return { ...authResponse, policyDocument };
  }

  // Optional output with custom properties of the String, Number or Boolean type.
  return authResponse;
};

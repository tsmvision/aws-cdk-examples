import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as ApiGatewayLambdaAuthorizer from "../lib/api_gateway-lambda-authorizer-stack";

test("Empty Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new ApiGatewayLambdaAuthorizer.ApiGatewayLambdaAuthorizerStack(
    app,
    "MyTestStack"
  );
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  );
});

import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigateway";

export class ApiGatewayLambdaAuthorizerStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // new lambda
    const helloWorld = new lambda.Function(this, "helloWorld", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources/lambdas"),
      handler: "helloWorld.handler",
    });

    // new authorizer lambda
    const helloWorldAuthorizer = new lambda.Function(
      this,
      "helloWorldAuthorizer",
      {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset("resources/lambdas"),
        handler: "helloWorldAuthorizer.handler",
      }
    );

    // new api gateway
    const api = new apigateway.RestApi(this, "ApiGateway-lambda-authorizer", {
      description: "Api gateway for helloWorld with authorizer",
    });

    // integrate lambda with api gateway
    const helloWorldIntegration = new apigateway.LambdaIntegration(
      helloWorld,
      {}
    );

    // setup authorizer
    const auth = new apigateway.TokenAuthorizer(this, "Authorizer", {
      handler: helloWorldAuthorizer,
    });

    // setup root route
    const root = api.root.addMethod("GET", helloWorldIntegration, {
      authorizer: auth,
    });
  }
}

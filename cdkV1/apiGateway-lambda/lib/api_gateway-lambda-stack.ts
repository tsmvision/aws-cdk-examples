import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigateway";

export class ApiGatewayLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // lambda function
    const getHelloWorld = new lambda.Function(this, "GetHelloWorld", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources"),
      handler: "getHelloWorld.handler",
    });

    const getMessages = new lambda.Function(this, "GetMessages", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources/messages"),
      handler: "getMessages.handler",
    });

    const postMessage = new lambda.Function(this, "PostMessage", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources/messages"),
      handler: "postMessage.handler",
    });

    const putMessage = new lambda.Function(this, "PutMessage", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources/messages"),
      handler: "putMessage.handler",
    });

    const getMessageById = new lambda.Function(this, "GetEmementById", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources/messages"),
      handler: "getMessageById.handler",
    });

    const deleteMessage = new lambda.Function(this, "deleteMessage", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources/messages"),
      handler: "deleteMessage.handler",
    });

    // api gateway
    const api = new apigateway.RestApi(this, "SampleApiGatewayLambda", {
      restApiName: "SampleApiGatewayLambda",
      description: "This is example api for lambda and api gateway",
    });

    const getHelloWorldIntegration = new apigateway.LambdaIntegration(
      getHelloWorld,
      {}
    );

    const getMessagesIntegration = new apigateway.LambdaIntegration(
      getMessages,
      {}
    );

    const postMessageIntegration = new apigateway.LambdaIntegration(
      postMessage,
      {}
    );

    const putMessageIntegration = new apigateway.LambdaIntegration(
      putMessage,
      {}
    );

    const getMessageByIdIntegration = new apigateway.LambdaIntegration(
      getMessageById,
      {}
    );

    const deleteMessageIntegration = new apigateway.LambdaIntegration(
      deleteMessage,
      {}
    );

    // Integrate lambda function to api gateway
    api.root.addMethod("GET", getHelloWorldIntegration);

    // "/messages" routes integration
    const messages = api.root.addResource("messages");
    messages.addMethod("GET", getMessagesIntegration);
    messages.addMethod("POST", postMessageIntegration);
    messages.addMethod("PUT", putMessageIntegration);
    messages.addMethod("DELETE", deleteMessageIntegration);

    const messagesWithParam = messages.addResource("{message_id}");
    messagesWithParam.addMethod("GET", getMessageByIdIntegration);
  }
}

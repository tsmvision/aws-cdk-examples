import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigateway";

export class ApiGatewayLambdaDynamodbStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create dynamodb
    const table = new dynamodb.Table(this, "Table", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
    });

    // readItemsLambda
    const readItemsLambdaFn = new lambda.Function(this, "ReadItemLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources/lambdas"),
      handler: "readItems.handler",
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    //  writeItemsLambda
    const writeItemsLambdaFn = new lambda.Function(this, "WriteItemLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources/lambdas"),
      handler: "writeItems.handler",
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // give dynamodb read permission to lambda
    table.grantReadData(readItemsLambdaFn);

    // give dynamodb write permission to writeItemslambda
    table.grantWriteData(writeItemsLambdaFn);

    // // create api gateway
    // const api = new apigateway.RestApi(this, "lambdaDynamoDBAPI");

    // // create lambdaintegration for api gateway
    // const lambdaFnIntegration = new apigateway.LambdaIntegration(lambdaFn, {});

    // // setup api gateway route
    // api.root.addMethod("GET", lambdaFnIntegration);
  }
}

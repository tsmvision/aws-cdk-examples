import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as rds from "@aws-cdk/aws-rds";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as apigateway from "@aws-cdk/aws-apigateway";

export class ApiGatewayLambdaAuroraServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create VPC
    const vpc = new ec2.Vpc(this, "MyVPC");

    // create AuroraDB serverless cluster
    const cluster = new rds.ServerlessCluster(this, "DbCluster", {
      engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
      vpc,
      // Optional - will be automatically set if you call grantDataApiAccess()
      enableDataApi: true,
    });

    // allow access database from any ipv4 ips.
    cluster.connections.allowDefaultPortFromAnyIpv4();

    // create lambda
    const getDataFn = new lambda.Function(this, "getDataFn", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources/lambdas/getData"),
      handler: "index.handler",
      // it looks like bug. disable this until figures out
      // timeout: cdk.Duration.seconds(30),
      retryAttempts: 2,
      environment: {
        CLUSTER_ARN: cluster.clusterArn || "",
        SECRET_ARN: cluster.secret?.secretArn || "",
      },
    });

    // grant lambda access to auroraDb
    cluster.grantDataApiAccess(getDataFn);

    // declare api gateway
    //////
    const api = new apigateway.RestApi(
      this,
      "apigateway-lambda-auroraServerless- ApiGateway",
      {}
    );

    // integration for api gateway and lambda
    const getDataFnIntegration = new apigateway.LambdaIntegration(
      getDataFn,
      {}
    );

    // apply integartion into root GET route
    api.root.addMethod("GET", getDataFnIntegration);
  }
}

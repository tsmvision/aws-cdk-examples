import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as rds from "@aws-cdk/aws-rds";
import * as secrets from "@aws-cdk/aws-secretsmanager";
import * as ssm from "@aws-cdk/aws-ssm";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigatewayv2";
import { LambdaProxyIntegration } from "@aws-cdk/aws-apigatewayv2-integrations";

export class RdsProxyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, "Vpc");

    // security group from lambda to RDS Proxy
    const lambdaToRDSProxyGroup = new ec2.SecurityGroup(
      this,
      "Lambda to RDS Proxy Connection",
      {
        vpc,
      }
    );

    // security RDS Proxy to RDS
    const RDSProxyToRDSGroup = new ec2.SecurityGroup(
      this,
      "Proxy to DB Connection",
      {
        vpc,
      }
    );

    // self define from RDSProxyToRDSGroup to RDSProxyToRDSGroup??? not clear yet
    RDSProxyToRDSGroup.addIngressRule(
      RDSProxyToRDSGroup,
      ec2.Port.tcp(3306),
      "allow db connection"
    );

    // allow lambda to access from lambdaToRDSProxyGroup to RDSProxyToRDSGroup
    RDSProxyToRDSGroup.addIngressRule(
      lambdaToRDSProxyGroup,
      ec2.Port.tcp(3306),
      "allow lambda connection"
    );

    const DATABASE_USER_NAME = "admin";

    // generateSecretString is not clear yet
    const dbCredentialsSecret = new secrets.Secret(
      this,
      "DBCredentialsSecret",
      {
        secretName: `${id}-rds-credentials`,
        generateSecretString: {
          secretStringTemplate: JSON.stringify({
            username: DATABASE_USER_NAME,
          }),
          excludePunctuation: true,
          includeSpace: false,
          generateStringKey: "password",
        },
      }
    );

    // looks like creating system level parameter string
    new ssm.StringListParameter(this, "DBCredentialsArn", {
      parameterName: "rds-credentials-arn",
      stringListValue: [dbCredentialsSecret.secretArn],
    });

    // MySQL DB Instance
    // delete protection disabled for testing
    const rdsInstance = new rds.DatabaseInstance(this, "DBInstance", {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_5_7_31,
      }),
      credentials: {
        username: DATABASE_USER_NAME,
        password: dbCredentialsSecret.secretValueFromJson("password"),
      },
      vpc,
      // destroy db instance when cdk destroy??
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // disable deletion protection
      deletionProtection: false,
      securityGroups: [RDSProxyToRDSGroup],
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO
      ),
    });

    // RDS Proxy
    const proxy = rdsInstance.addProxy(`${id}-proxy`, {
      secrets: [dbCredentialsSecret],
      debugLogging: true,
      vpc,
      securityGroups: [RDSProxyToRDSGroup],
    });

    // lambda
    const rdsLambda = new lambda.Function(this, "rdsProxyHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources/lambdas", {}),
      handler: "rdsLambda.handler",
      vpc,
      securityGroups: [lambdaToRDSProxyGroup],
      environment: {
        PROXY_ENDPOINT: proxy.endpoint,
        RDS_SECRET_NAME: `${id}-rds-credentials`,
      },
    });

    // allow lambda to read credentials from secrets manager
    dbCredentialsSecret.grantRead(rdsLambda);

    // create new api gateway v2
    // integrate api gateway v2 with lambda
    const api = new apigateway.HttpApi(this, "Endpoint", {
      defaultIntegration: new LambdaProxyIntegration({
        handler: rdsLambda,
      }),
    });

    // display api url in the cloudformation console output.
    new cdk.CfnOutput(this, "HTTP API Url", {
      value: api.url || "Something went wrong with the deploy",
    });
  }
}

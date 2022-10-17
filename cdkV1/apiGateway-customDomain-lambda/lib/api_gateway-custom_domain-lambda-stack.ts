import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as certificateManager from "@aws-cdk/aws-certificatemanager";
import * as route53Targets from "@aws-cdk/aws-route53-targets";
import * as route53 from "@aws-cdk/aws-route53";
import * as dotenv from "dotenv";

// initialize dotenv for .env
dotenv.config();

// get the environment variables from .env
const {
  CERTIFICATE_ARN = "",
  RECORD_NAME = "",
  API_DOMAIN_NAME = "",
  HOSTED_ZONE_ID = "",
  HOSTED_ZONE_NAME = "",
} = process.env;

export class ApiGatewayCustomDomainLambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // lambda
    const helloWorld = new lambda.Function(this, "HelloWorldLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources/lambdas"),
      handler: "helloWorld.handler",
    });

    // api gateway
    const api = new apigateway.RestApi(this, "ApiGateway-customdomain-lambda");

    // lambda api gateway integration
    const helloWorldIntegration = new apigateway.LambdaIntegration(
      helloWorld,
      {}
    );

    // integrate root route with helloWorldcd
    api.root.addMethod("GET", helloWorldIntegration);

    // create custom domain
    const customDomain = new apigateway.DomainName(this, "customDomain", {
      domainName: API_DOMAIN_NAME,
      certificate: certificateManager.Certificate.fromCertificateArn(
        this,
        "ACM-Certificate",
        CERTIFICATE_ARN
      ),
      // https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html
      // default is Edge
      // api endpoint such as Region, Edge, and etc
      endpointType: apigateway.EndpointType.EDGE,
    });

    // associate the custom domain with new Api Gateway
    new apigateway.BasePathMapping(this, "CustomBasePathMapping", {
      domainName: customDomain,
      restApi: api,
    });

    // get existing hosted zone
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId: HOSTED_ZONE_ID,
        zoneName: HOSTED_ZONE_NAME,
      }
    );

    // setup record target
    const recordTarget = route53.RecordTarget.fromAlias(
      new route53Targets.ApiGatewayDomain(customDomain)
    );

    // setup ipv4 alias
    new route53.ARecord(this, "ApiRecordSetA", {
      zone: hostedZone,
      recordName: RECORD_NAME,
      target: recordTarget,
    });

    // setup ipv6 alias
    new route53.AaaaRecord(this, "ApiRecordSetAAAA", {
      zone: hostedZone,
      recordName: RECORD_NAME,
      target: recordTarget,
    });
  }
}

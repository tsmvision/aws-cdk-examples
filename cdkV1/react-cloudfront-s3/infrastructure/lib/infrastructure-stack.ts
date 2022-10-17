import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // S3
    const bucket = new s3.Bucket(this, "ReactAppBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      publicReadAccess: true,
      cors: [
        {
          allowedOrigins: ["*"],
          allowedMethods: [s3.HttpMethods.GET],
        },
      ],
    });

    // s3 deployment
    const reactSource = s3Deploy.Source.asset("./build");
    const s3Deployment = new s3Deploy.BucketDeployment(
      this,
      "DeployReactBucket",
      {
        sources: [reactSource],
        destinationBucket: bucket,
      }
    );

    // cloudfront
    const cf = new cloudfront.CloudFrontWebDistribution(
      this,
      "reactAppDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );
  }
}

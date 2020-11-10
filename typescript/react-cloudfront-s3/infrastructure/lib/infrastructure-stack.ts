import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
// import * as iam from "@aws-cdk/aws-iam";

const BUCKET_NAME = "luke-lee-blah-blah-website";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const bucket = new s3.Bucket(this, "WebsiteBucket", {
      // any bucket name that you want
      bucketName: BUCKET_NAME,
      // Specify the index document for the website.
      websiteIndexDocument: "index.html",
      // Allow public access to our bucket
      // blockPublicAccess: new s3.BlockPublicAccess({
      //   restrictPublicBuckets: false,
      // }),
    });

    // const bucketPolicy = new iam.PolicyStatement({
    //   actions: ["s3:GetObject"],
    //   resources: [`${bucket.bucketArn}/*`],
    //   // Allow public access to our bucket
    //   principals: [new iam.AnyPrincipal()],
    // });

    // bucket.addToResourcePolicy(bucketPolicy);

    // An OAI restricts access to an S3 bucket and its content to only CloudFront and operations it performs.
    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(this, "OAI");

    bucket.grantRead(cloudFrontOAI.grantPrincipal);
    // distribute to cloudfront
    const CLOUDFRONT_NAME = `${BUCKET_NAME}_distribution`;

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      CLOUDFRONT_NAME,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: cloudFrontOAI,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    // cloudfront invalidate setup

    // display s3 web URL
    // display cloudfront URL

    // certificateManager
    // Route53
  }
}

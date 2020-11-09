import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as iam from "@aws-cdk/aws-iam";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const bucket = new s3.Bucket(this, "WebsiteBucket", {
      // any bucket name that you want
      bucketName: "luke-lee-blah-blah-website",
      // Specify the index document for the website.
      websiteIndexDocument: "index.html",
      // Allow public access to our bucket
      blockPublicAccess: new s3.BlockPublicAccess({
        restrictPublicBuckets: false,
      }),
    });

    const bucketPolicy = new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      resources: [`${bucket.bucketArn}/*`],
      // Allow public access to our bucket
      principals: [new iam.AnyPrincipal()],
    });

    bucket.addToResourcePolicy(bucketPolicy);
  }
}

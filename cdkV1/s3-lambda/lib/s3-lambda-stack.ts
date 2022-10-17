import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as lambda from "@aws-cdk/aws-lambda";
import { S3EventSource } from "@aws-cdk/aws-lambda-event-sources";

export class S3LambdaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create s3
    const bucket = new s3.Bucket(this, "ResizedImageBucket");

    // create lambda
    const resizeImageLambda = new lambda.Function(this, "ResizeImageLambda", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("resources/lambdas"),
      handler: "resizeImage.handler",
    });

    resizeImageLambda.addEnvironment("S3_NAME", bucket.bucketName);

    // create event source
    const s3EventSource = new S3EventSource(bucket, {
      events: [s3.EventType.OBJECT_CREATED],
      // filters: [ { prefix: 'subdir/' } ]
    });

    // assign event source with lambda function
    resizeImageLambda.addEventSource(s3EventSource);

    // grant s3 bucket read/write permission to lambda function
    bucket.grantReadWrite(resizeImageLambda);

    // // lambda resize file
    // // save resized file into /resize in the s3
  }
}

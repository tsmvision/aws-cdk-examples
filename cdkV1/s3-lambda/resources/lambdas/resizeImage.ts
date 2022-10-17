import * as AWS from "aws-sdk";
import * as sharp from "sharp";

interface IRecord {
  eventVersion: string;
  eventSource: string;
  eventTime: string;
  eventName: string;

  userIdentity: {
    principalId: string;
  };

  requestParameters: {
    sourceIPAddress: string;
  };

  responseElements: {
    "x-amz-request-id": string;
    "x-amz-id-2": string;
  };

  s3: {
    s3SchemaVersion: string;
    configurationId: string;
    bucket: {
      name: string;
      ownerIdentity: {
        principalId: string;
      };
      arn: string;
    };
    object: {
      key: string;
      size: number;
      eTag: string;
      sequencer: string;
    };
  };
}

interface IEvent {
  Records: IRecord[];
}

// reference: https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html
export const handler = async (event: IEvent) => {
  console.log();
  const Key = event.Records[0].s3.object.key;

  const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

  var bucketParams = {
    Bucket: process.env.S3_NAME || "",
    Key,
  };

  // download the image from the S3 source bucket.
  let originalImage;
  try {
    originalImage = await s3.getObject(bucketParams).promise();
  } catch (error) {
    console.log(error);
    return;
  }

  // TODO: find how to convert image using s3 and sharp library.

  // set thumbnail width. Resize will set the height automatically to maintain aspect ratio.
  const WIDTH = 200;

  // USE the Sharp module to resize the image and save in a buffer.
  let buffer;

  // try {
  //   buffer = await sharp(originalImage).resize(WIDTH).toBuffer();
  // } catch (error) {
  //   console.log(error);
  //   return;
  // }

  // upload the file to /resized/[file_name]

  console.log("Successfully resized");
};

import * as cdk from "@aws-cdk/core";
import * as ecr from "@aws-cdk/aws-ecr";

export class EcrStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create "Repository" repository in the ECR
    const repository = new ecr.Repository(this, "Repository", {
      imageScanOnPush: true,
    });
  }
}

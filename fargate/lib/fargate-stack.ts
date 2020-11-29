import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";

// Reference
// https://docs.aws.amazon.com/cdk/latest/guide/ecs_example.html
export class FargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "fargateVpc", {
      maxAzs: 3, // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "FargateCluster", {
      vpc,
    });

    // Create a load-balanced Fargate service and make it public
    const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "FargateService",
      {
        cluster,
        cpu: 256, // Default is 256
        desiredCount: 1, // Default is 1
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry(
            "mcr.microsoft.com/dotnet/samples:aspnetapp"
          ),
        },
        memoryLimitMiB: 512, // Default is 512
        publicLoadBalancer: true, // Defauls is false
        // redirectHTTP: true, // redirect http to https,
      }

      // setup certificate
      // assign to route53 for custom domain
    );
  }
}

import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";

export class Fargate02Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // vpc
    const vpc = new ec2.Vpc(this, "fargateVpc", {
      maxAzs: 2,
      natGateways: 1,
    });

    // cluster
    const cluster = new ecs.Cluster(this, "FargateCluster", {
      vpc,
    });

    // deploy container in the service with application load balancer
    const webService = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "webService",
      {
        cluster,
        memoryLimitMiB: 512,
        cpu: 256,
        // desiredCount: 1,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        },
      }
    );

    // server health check
    webService.targetGroup.configureHealthCheck({
      path: "/",
    });

    // output web service Url
    new cdk.CfnOutput(this, "webServiceUrl", {
      value: webService.loadBalancer.loadBalancerDnsName,
      description: "Access the web service url from your browser",
    });
  }
}

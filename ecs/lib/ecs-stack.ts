import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";

// for multiple task in a cluster
// You dont need to create a cluster for second service. You need create another task definition with
// new image of second service (deployed to the ECR). Next step is create a service in the cluster and
// setup Service discovery in the Configure network step.

export class EcsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create vpc
    const vpc = new ec2.Vpc(this, "ecsVpc", {
      maxAzs: 2,
      natGateways: 1,
    });

    // create ecs cluster
    const cluster = new ecs.Cluster(this, "ecsCluster", {
      vpc,
    });

    // define ecs cluster capacity
    cluster.addCapacity("ecsAutoScalingGroup", {
      instanceType: new ec2.InstanceType("t2.micro"),
    });

    // deploy container in the microservice and attach a loadbalancer
    const loadBalancerWebService = new ecs_patterns.ApplicationLoadBalancedEc2Service(
      this,
      "webService",
      {
        cluster,
        memoryLimitMiB: 512, // soft limit
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        },
      }
    );

    // output web serivice url
    const output01 = new cdk.CfnOutput(this, "webServiceUrl", {
      value: `${loadBalancerWebService.loadBalancer.loadBalancerDnsName}`,
      description: "Access the web service url from your browser",
    });
  }
}

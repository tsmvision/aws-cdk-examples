import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterens from "@aws-cdk/aws-ecs-patterns";
import * as sqs from "@aws-cdk/aws-sqs";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";

export class EcsEcrStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // vpc
    const vpc = new ec2.Vpc(this, "MyVpc");

    // task definition
    const taskDefinition = new ecs.TaskDefinition(this, "TaskDef", {
      compatibility: ecs.Compatibility.FARGATE,
      cpu: "256",
      memoryMiB: "512",
    });

    // container
    const container = taskDefinition.addContainer("web", {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
    });

    // container port mapping
    // container.addPortMappings({
    //   containerPort: 80,
    //   // hostPort: 8080,
    //   protocol: ecs.Protocol.TCP,
    // });

    // cluster
    const cluster = new ecs.Cluster(this, "Cluster");

    cluster.addCapacity("capacity", {
      instanceType: new ec2.InstanceType("t2-micro"),
    });

    // create service
    const service = new ecs.Ec2Service(this, "Service", {
      cluster,
      taskDefinition,
    });

    // create ALB
    const lb = new elbv2.ApplicationLoadBalancer(this, "LB", {
      vpc,
      internetFacing: true,
    });

    const listener = lb.addListener("PublicListener", {
      port: 80,
      open: true,
    });

    // attach ALB to ECS Service
    listener.addTargets("ECS", {
      port: 80,
      targets: [service],
      // include health check (default is none)
      healthCheck: {
        interval: cdk.Duration.seconds(60),
        path: "/health",
        timeout: cdk.Duration.seconds(5),
      },
    });
  }
}

import * as cdk from "@aws-cdk/core";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecr from "@aws-cdk/aws-ecr";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2";
import * as dotenv from "dotenv";

// initialize dotenv for accessing .env
dotenv.config();

export class EcsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // vpc
    const vpc = new ec2.Vpc(this, "EcsVpc", {
      // maxAzs: 2,
    });

    // Cteate an ECS cluster
    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc,
    });

    // add capacity to it
    cluster.addCapacity("DefaultAutoScalingGroupCapacity", {
      instanceType: new ec2.InstanceType("t2.micro"),
      desiredCapacity: 1,
    });

    // task definition
    const taskDefinition = new ecs.Ec2TaskDefinition(this, "TaskDef");

    // get value from .env
    const { REPOSITORY_NAME = "" } = process.env;

    // ecr repository
    const repository = ecr.Repository.fromRepositoryName(
      this,
      "Repository",
      REPOSITORY_NAME
    );

    // add container to task definition
    const container = taskDefinition.addContainer("DefaultContainer", {
      image: ecs.ContainerImage.fromEcrRepository(repository),
      memoryLimitMiB: 512,
    });

    // mapping port (next.js port 3000)
    container.addPortMappings({
      containerPort: 3000, // container's port
      // hostPort: 80, // public facing port
    });

    // instantiate an ECS service
    const service = new ecs.Ec2Service(this, "Service", {
      cluster,
      taskDefinition,
    });

    // // load balancer
    // const lb = new elbv2.ApplicationLoadBalancer(this, "LB", {
    //   vpc,
    //   internetFacing: true,
    // });

    // // add listener
    // const listener = lb.addListener("Listener", {
    //   port: 80,
    // });

    // // load balancer target
    // const targetGroup = listener.addTargets("ApplicationFleet", {
    //   // port: 80,
    //   protocol: elbv2.ApplicationProtocol.HTTP,
    //   targets: [
    //     service.loadBalancerTarget({
    //       containerName: "DefaultContainer",
    //       containerPort: 3000,
    //     }),
    //   ],
    // });
  }

  // add ssl certificate

  // 443 -> 80
}

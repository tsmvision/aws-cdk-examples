import { Ec2Service } from "@aws-cdk/aws-ecs";
import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as cloudwatch from "@aws-cdk/aws-cloudwatch";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import * as schedule from "@aws-cdk/aws-applicationautoscaling";

export class CloudwatchFargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // vpc
    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 2,
    });

    // cluster
    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc,
    });

    // // deploy batch processing container task in fargate with cloudwatch event schedule
    // const task = new ecs_patterns.ScheduledFargateTask(this, "Task", {
    //   cluster,
    //   scheduledFargateTaskImageOptions: {
    //     image: ecs.ContainerImage.fromRegistry(
    //       "mcr.microsoft.com/dotnet/samples:aspnetapp"
    //     ),
    //     cpu: 256,
    //     memoryLimitMiB: 512,
    //   },
    //   schedule: new schedule.Schedule()
    // });
  }
}

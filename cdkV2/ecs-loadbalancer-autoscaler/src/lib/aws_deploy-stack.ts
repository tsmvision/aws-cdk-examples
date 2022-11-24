import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { CpuArchitecture } from "aws-cdk-lib/aws-ecs";
import { getRepositoryArn } from "../utility/envUtility";
import { CfnLoadBalancer } from "aws-cdk-lib/aws-elasticloadbalancingv2";

// TODO: .env
// TODO: add awslog
// TODO: display log including loadbalancer url
// TODO: apply https
// TODO: integrate with Api Gateway or something else for https

// const REPOSITORY_ARN = process.env.REPOSITORY_ARN
//   ? process.env.REPOSITORY_ARN
//   : "";

export class AwsDeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // TODO: use default vpc rather than generating new one.
    // The code that defines your stack goes here
    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 2, // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "HelloWorldCluster", {
      vpc,
    });

    const repository = ecr.Repository.fromRepositoryArn(
      this,
      "helloWorldRepository",
      "arn:aws:ecr:us-east-1:183844933110:repository/hello-world"
    );

    const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDef", {
      memoryLimitMiB: 1024,
      cpu: 512,
      //           ephemeralStorageGiB: 10
      runtimePlatform: {
        cpuArchitecture: CpuArchitecture.ARM64,
      },
    });

    const container = taskDefinition.addContainer("HelloWorldContainer", {
      image: ecs.ContainerImage.fromEcrRepository(repository, "v1"),
      portMappings: [
        {
          containerPort: 8080,
        },
      ],
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "HelloWorldContainer" }),
    });

    const service = new ecs.FargateService(this, "Service", {
      cluster,
      taskDefinition,
      desiredCount: 1,
    });

    const lb = new elbv2.ApplicationLoadBalancer(this, "LB", {
      vpc,
      internetFacing: true,
    });

    const listener = lb.addListener("Listener", { port: 80 });
    const targetGroup1 = listener.addTargets("ecsTarget", {
      port: 80,
      targets: [service],
    });

    // generate certificate

    // const listenerCertificate = elbv2.ListenerCertificate.fromArn("aaa");

    // listener.addCertificates("certificate01", [listenerCertificate]);

    //

    const scaling = service.autoScaleTaskCount({ maxCapacity: 10 });
    scaling.scaleOnCpuUtilization("CpuScaling", {
      targetUtilizationPercent: 50,
    });

    scaling.scaleOnRequestCount("RequestScaling", {
      requestsPerTarget: 10000,
      targetGroup: targetGroup1,
    });
  }
}

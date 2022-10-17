import * as cdk from "@aws-cdk/core";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import * as ecr_assets from "@aws-cdk/aws-ecr-assets";
import * as logs from "@aws-cdk/aws-logs";

// Reference
// http://blog.jeffbryner.com/2020/07/20/aws-cdk-docker-explorations.html

// find the way with target group

export class FargateMultipleServicesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // vpc
    const vpc = new ec2.Vpc(this, "MyVpc", {
      maxAzs: 3, // Default is all AZs in region
    });

    // cluster
    const cluster = new ecs.Cluster(this, "MyCluster", {
      vpc,
    });

    // service discovery
    // The ability for one service to reference another starts with the instantiation of a cloud map for our cluster:
    cluster.addDefaultCloudMapNamespace({
      name: "service.local",
    });

    const frontendAsset = new ecr_assets.DockerImageAsset(this, "frontend", {
      directory: "./frontend",
      file: "Dockerfile",
    });

    const frontendTask = new ecs.FargateTaskDefinition(this, "frontend-task", {
      cpu: 512,
      memoryLimitMiB: 2048,
    });

    const frontendContainer = frontendTask.addContainer("frontend", {
      image: ecs.ContainerImage.fromDockerImageAsset(frontendAsset),
      essential: true,
      environment: {
        LOCAL_DOMAIN: "service.local",
      },
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: "FronendContainer",
        logRetention: logs.RetentionDays.ONE_WEEK,
      }),
    });

    frontendContainer.addPortMappings({
      containerPort: 5000,
      hostPort: 5000,
    });

    // backend task
    const backendAsset = new ecr_assets.DockerImageAsset(this, "backend", {
      directory: "./server",
      file: "Dockerfile",
    });

    const backendTask = new ecs.FargateTaskDefinition(this, "frontend-task", {
      cpu: 512,
      memoryLimitMiB: 2048,
    });

    const backendContainer = backendTask.addContainer("backend", {
      image: ecs.ContainerImage.fromDockerImageAsset(backendAsset),
      essential: true,
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: "BackendContainer",
        logRetention: logs.RetentionDays.ONE_WEEK,
      }),
    });

    backendContainer.addPortMappings({
      containerPort: 4000,
      hostPort: 4000,
    });

    // frontend service
    const frontendService = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "frontend-service",
      {
        serviceName: "frontend",
        cluster,
        // cloudMapOptions:  // ???
        cpu: 512, // Default is 256
        desiredCount: 2, // Default is 512
        listenerPort: 4000,
        publicLoadBalancer: true,
      }
    );

    frontendService.service.connections.allowFromAnyIpv4(
      ec2.Port.tcp(5000),
      "frontend inbound"
    );

    // backend service
    const backendService = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "backend-service",
      {
        serviceName: "backend",
        cluster,
        // cloudMapOptions:  // ???
        cpu: 512, // Default is 256
        desiredCount: 2, // Default is 512
        listenerPort: 5000,
        publicLoadBalancer: true,
      }
    );

    backendService.targetGroup.addTarget(frontendService.service);

    backendService.service.connections.allowFrom(
      frontendService.service,
      ec2.Port.tcp(5000)
    );
  }
}

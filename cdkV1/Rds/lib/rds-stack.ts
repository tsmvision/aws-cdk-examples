import * as cdk from "@aws-cdk/core";
import * as rds from "@aws-cdk/aws-rds";
import * as ec2 from "@aws-cdk/aws-ec2";

export class RdsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "RDB-Vpc");

    // BEGIN Setup RDS
    // DB credential stored in Secrets Manager

    // Aurora MySQL RDS
    const db = new rds.DatabaseCluster(this, "Database", {
      engine: rds.DatabaseClusterEngine.auroraMysql({
        version: rds.AuroraMysqlEngineVersion.VER_2_09_0,
      }),
      instanceProps: {
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.BURSTABLE2,
          ec2.InstanceSize.SMALL
        ),
        vpcSubnets: {
          // production might need PRIVATE.
          subnetType: ec2.SubnetType.PUBLIC,
        },
        vpc,
      },
    });

    // //  Aurora PostgreSQL RDS
    // const db = new rds.DatabaseCluster(this, "Database", {
    //   engine: rds.DatabaseClusterEngine.auroraPostgres({
    //     version: rds.AuroraPostgresEngineVersion.VER_11_8,
    //   }),
    //   instanceProps: {
    //     instanceType: ec2.InstanceType.of(
    //       // aurora postgresql support from db.t3.medium
    //       ec2.InstanceClass.BURSTABLE3,
    //       ec2.InstanceSize.MEDIUM
    //     ),
    //     vpcSubnets: {
    //       // It might be Private in production
    //       subnetType: ec2.SubnetType.PUBLIC,
    //     },
    //     vpc,
    //   },
    // });

    // reference
    // https://aws.amazon.com/getting-started/hands-on/configure-connect-serverless-mysql-database-aurora/
    // Because Aurora Serverless DB clusters do not have publically accessible endpoints, your MyClusterName can only be accessed from within the same VPC.
    // Aurora MySQL Serverless RDS
    // const db = new rds.ServerlessCluster(this, "Database", {
    //   engine: rds.DatabaseClusterEngine.auroraMysql({
    //     version: rds.AuroraMysqlEngineVersion.VER_2_09_0,
    //   }),
    //   vpcSubnets: {
    //     // It might be Private in production
    //     subnetType: ec2.SubnetType.PUBLIC,
    //   },
    //   enableDataApi: true,
    //   vpc,
    // });

    // // Aurora PostgreSQL Serverless RDS
    // const db = new rds.ServerlessCluster(this, "Database", {
    //   engine: rds.DatabaseClusterEngine.auroraPostgres({
    //     version: rds.AuroraPostgresEngineVersion.VER_11_8,
    //   }),
    //   vpcSubnets: {
    //     // It might be Private in production
    //     subnetType: ec2.SubnetType.PUBLIC,
    //   },
    //   enableDataApi: true,
    //   vpc,
    // });

    // // MySQL RDS
    // const db = new rds.DatabaseInstance(this, "Database", {
    //   engine: rds.DatabaseInstanceEngine.mysql({
    //     version: rds.MysqlEngineVersion.VER_8_0_21,
    //   }),
    //   // optional , defaults to t3.medium
    //   instanceType: ec2.InstanceType.of(
    //     ec2.InstanceClass.BURSTABLE2,
    //     ec2.InstanceSize.SMALL
    //   ),
    //   // Optional - will default to 'admin' username and generated password
    //   // credentials: rds.Credentials.fromGeneratedSecret('syscdk'),
    //   vpcSubnets: {
    //     subnetType: ec2.SubnetType.PUBLIC,
    //   },
    //   vpc,
    // });

    // // MariaDB RDS
    // const db = new rds.DatabaseInstance(this, "Database", {
    //   engine: rds.DatabaseInstanceEngine.mariaDb({
    //     version: rds.MariaDbEngineVersion.VER_10_4_8,
    //   }),
    //   //optional , defaults to t3.medium
    //   instanceType: ec2.InstanceType.of(
    //     ec2.InstanceClass.BURSTABLE2,
    //     ec2.InstanceSize.SMALL
    //   ),
    //   vpcSubnets: {
    //     // It might be Private in production
    //     subnetType: ec2.SubnetType.PUBLIC,
    //   },
    //   vpc,
    // });

    // // PostgreSQL RDS
    // const db = new rds.DatabaseInstance(this, "Database", {
    //   engine: rds.DatabaseInstanceEngine.postgres({
    //     version: rds.PostgresEngineVersion.VER_12_4,
    //   }),
    //   // optional , defaults to t3.medium
    //   instanceType: ec2.InstanceType.of(
    //     ec2.InstanceClass.BURSTABLE2,
    //     ec2.InstanceSize.SMALL
    //   ),
    //   vpcSubnets: {
    //     // It might be Private in production
    //     subnetType: ec2.SubnetType.PUBLIC,
    //   },
    //   vpc,
    // });

    // Open Database Port (TCP 3306) to public using security group configuration
    db.connections.allowDefaultPortFromAnyIpv4();

    // END Setup RDS

    // rds proxy
  }
}

import {
  getVpcFullName,
  getRdsName,
  getRdsPassword,
  getRdsUsername,
  getRdsDatabaseName,
  getPostgresqlPort,
} from "./../utility/envUtility";
import * as cdk from "aws-cdk-lib";
import { SecretValue } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";

export class RdsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcName = getVpcFullName();

    const vpc = ec2.Vpc.fromLookup(this, vpcName, {
      vpcName,
    });

    const databaseSecurityGroup = new ec2.SecurityGroup(
      this,
      "databaseSecurityGroup",
      {
        vpc,
        allowAllOutbound: true,
        description: "security group for postgresql database",
      }
    );

    databaseSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(getPostgresqlPort()),
      "allow hTTP traffic from anywhere"
    );

    const databaseInstance = new rds.DatabaseInstance(this, getRdsName(), {
      engine: rds.DatabaseInstanceEngine.POSTGRES,
      credentials: rds.Credentials.fromPassword(
        getRdsUsername(),
        SecretValue.unsafePlainText(getRdsPassword())
      ),
      databaseName: getRdsDatabaseName(),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      securityGroups: [databaseSecurityGroup],
      vpc,
      publiclyAccessible: true,
    });

    new cdk.CfnOutput(this, "databaseInstance", {
      value: databaseInstance.dbInstanceEndpointAddress,
    });

    new cdk.CfnOutput(this, "databaseInstance arn", {
      value: databaseInstance.instanceArn,
    });
  }
}

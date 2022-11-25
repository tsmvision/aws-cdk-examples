# Welcome to your VPC and RDS project

This is a project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Requirements

* node.js LTS version
* cdk

## How to initialize project
Bootstrapping is the process of provisioning resources for the AWS CDK before you can deploy AWS CDK apps into an AWS environment. (An AWS environment is a combination of an AWS account and Region).

Reference: [https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html)

```
$ npm run cdk-bootsrap
```

## How to synth and deploy cloudformation stacks.

### clear cdk.context.json

```
$ npm run clear-cdk-context
```
### synth vpc

```
$ npm run synth-vpc
```

### deploy vpc to the AWS

```
$ npm run deploy-vpc
```

### synth rds

```
$ npm run synth-rds
```

### deploy rds to the AWS

```
$ npm run deploy-rds
```
# Welcome to your VPC and RDS project

This is a project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Requirements

* node.js LTS version
* cdk

## How to initialize project

Initialize Cdk project to let code create CdkToolkit in the AWS for handling cdk code in the next steps.

```
$ npm run cdk-bootstrap
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
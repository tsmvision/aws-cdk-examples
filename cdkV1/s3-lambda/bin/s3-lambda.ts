#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { S3LambdaStack } from '../lib/s3-lambda-stack';

const app = new cdk.App();
new S3LambdaStack(app, 'S3LambdaStack');

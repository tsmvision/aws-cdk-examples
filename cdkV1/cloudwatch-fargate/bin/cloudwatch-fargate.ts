#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CloudwatchFargateStack } from '../lib/cloudwatch-fargate-stack';

const app = new cdk.App();
new CloudwatchFargateStack(app, 'CloudwatchFargateStack');

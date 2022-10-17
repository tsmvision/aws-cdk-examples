#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { FargateMultipleServicesStack } from '../lib/fargate-multiple-services-stack';

const app = new cdk.App();
new FargateMultipleServicesStack(app, 'FargateMultipleServicesStack');

#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiGatewayLambdaStack } from '../lib/api_gateway-lambda-stack';

const app = new cdk.App();
new ApiGatewayLambdaStack(app, 'ApiGatewayLambdaStack');

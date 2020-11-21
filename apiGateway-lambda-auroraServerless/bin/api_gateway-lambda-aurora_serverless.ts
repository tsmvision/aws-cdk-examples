#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiGatewayLambdaAuroraServerlessStack } from '../lib/api_gateway-lambda-aurora_serverless-stack';

const app = new cdk.App();
new ApiGatewayLambdaAuroraServerlessStack(app, 'ApiGatewayLambdaAuroraServerlessStack');

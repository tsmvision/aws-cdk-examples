#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiGatewayLambdaRdsRdsProxyStack } from '../lib/api_gateway-lambda-rds-rds_proxy-stack';

const app = new cdk.App();
new ApiGatewayLambdaRdsRdsProxyStack(app, 'ApiGatewayLambdaRdsRdsProxyStack');

#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ApiGatewayLambdaDynamodbStack } from '../lib/api_gateway-lambda-dynamodb-stack';

const app = new cdk.App();
new ApiGatewayLambdaDynamodbStack(app, 'ApiGatewayLambdaDynamodbStack');

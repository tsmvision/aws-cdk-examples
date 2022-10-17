#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { ApiGatewayLambdaAuthorizerStack } from "../lib/api_gateway-lambda-authorizer-stack";

const app = new cdk.App();
new ApiGatewayLambdaAuthorizerStack(app, "ApiGatewayLambdaAuthorizerStack");

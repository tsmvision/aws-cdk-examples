#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { ApiGatewayCustomDomainLambdaStack } from "../lib/api_gateway-custom_domain-lambda-stack";

const app = new cdk.App();
new ApiGatewayCustomDomainLambdaStack(app, "ApiGatewayCustomDomainLambdaStack");

#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RdsProxyStack } from '../lib/rds-proxy-stack';

const app = new cdk.App();
new RdsProxyStack(app, 'RdsProxyStack');

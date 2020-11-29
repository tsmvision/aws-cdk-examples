#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Fargate02Stack } from '../lib/fargate02-stack';

const app = new cdk.App();
new Fargate02Stack(app, 'Fargate02Stack');

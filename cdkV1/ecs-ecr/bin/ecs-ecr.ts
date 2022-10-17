#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcsEcrStack } from '../lib/ecs-ecr-stack';

const app = new cdk.App();
new EcsEcrStack(app, 'EcsEcrStack');

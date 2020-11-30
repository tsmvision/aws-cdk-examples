#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcrStack } from '../lib/ecr-stack';

const app = new cdk.App();
new EcrStack(app, 'EcrStack');

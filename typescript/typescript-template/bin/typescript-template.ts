#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { TypescriptTemplateStack } from '../lib/typescript-template-stack';

const app = new cdk.App();
new TypescriptTemplateStack(app, 'TypescriptTemplateStack');

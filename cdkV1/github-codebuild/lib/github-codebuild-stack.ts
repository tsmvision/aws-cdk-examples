import * as cdk from "@aws-cdk/core";
import * as codebuild from "@aws-cdk/aws-codebuild";
import * as scretsmanager from "@aws-cdk/aws-secretsmanager";
import * as dotnenv from "dotenv";
import * as codepipeline from "@aws-cdk/aws-codepipeline";
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import * as s3 from "@aws-cdk/aws-s3";

// activate dotenv library for .env
dotnenv.config();

// get the value from .env
const { GITHUB_OWNER = "", GITHUB_REPO = "", S3_BUCKET_ARN = "" } = process.env;

export class GithubCodebuildStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // get code from github
    // const githubSource = codebuild.Source.gitHub({
    //   owner: GITHUB_OWNER,
    //   repo: GITHUB_REPO,
    //   webhook: true,
    //   webhookFilters: [
    //     codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs(
    //       "master"
    //     ),
    //     // optional, by default all pushes and Pull Requests will trigger a build
    //   ],
    // });

    // find github key value handling!!!
    const githubSecret = scretsmanager.Secret.fromSecretNameV2(
      this,
      "GithubSecret",
      "github_ssh_key"
    );

    new cdk.CfnOutput(this, "github secret key", {
      value: githubSecret.secretValue.toString(),
    });

    // // React S3 Bucket
    // const s3Bucket = s3.Bucket.fromBucketArn(
    //   this,
    //   "reactS3Bucket",
    //   S3_BUCKET_ARN
    // );

    // // artifact
    // const reactBuild = new codebuild.PipelineProject(this, "MyProject", {
    //   buildSpec: codebuild.BuildSpec.fromObject({
    //     version: "0.2",
    //     phase: {
    //       install: {
    //         commands: "npm install",
    //       },
    //       unitTest: {
    //         commands: "npm run test",
    //       },
    //       build: {
    //         commands: ["npm run build"],
    //       },
    //       artifacts: {
    //         base_directory: "dist",
    //       },
    //     },
    //   }),
    // });

    // const s3Deploy = new codebuild.PipelineProject(this, "S3Build", {
    //   buildSpec: codebuild.{
    //     version: "0.2",
    //     phase: {

    //     }
    //   }
    // });

    const sourceOutput = new codepipeline.Artifact();
    const reactBuildOutput = new codepipeline.Artifact("ReactBuildOutput");

    // pipeline
    new codepipeline.Pipeline(this, "ReactPipeline", {
      stages: [
        {
          stageName: "Source",
          actions: [
            new codepipeline_actions.GitHubSourceAction({
              actionName: "Github_Source",
              owner: GITHUB_OWNER,
              repo: GITHUB_REPO,
              branch: "master",
              oauthToken: githubSecret.secretValue,
              // how to get codes from github when triggered???
              trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
              output: sourceOutput,
            }),
          ],
        },
        //     {
        //       stageName: "Build",
        //       actions: [
        //         new codepipeline_actions.CodeBuildAction({
        //           actionName: "React_UnitTest",
        //           project: reactBuild,
        //           input: sourceOutput,
        //           outputs: [reactBuildOutput],
        //         }),
        //       ],
        //     },
        //     {
        //       stageName: "Deploy",

        //       // deploy to s3
        //       actions: [],
        //     },
      ],
    });

    // setup hooks

    // react build
    // stage 1 - unit testing
    // stage 2 - build code

    // react code deploy
    // upload built code to s3

    // api build
    // unit testing
    // re-create ecs fargate using the built code.

    // api deploy
    //
  }
}

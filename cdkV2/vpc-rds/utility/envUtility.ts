import * as dotenv from "dotenv";

dotenv.config();

const getCdkDefaultAccount = () => {
  return process.env.CDK_DEFAULT_ACCOUNT || "";
};

const getCdkDefaultRegion = () => {
  return process.env.CDK_DEFAULT_REGION || "";
};

export const getEnv = () => {
  return { account: getCdkDefaultAccount(), region: getCdkDefaultRegion() };
};

const vpcStackName = "VpcStack";
const vpcName = "CustomVpc";

const rdsStackName = "RdsStack";
const rdsName = "CustomRds";

const POSTGRESQL_PORT = 5432;

export const getVpcStackName = () => {
  return vpcStackName;
};

export const getVpcName = () => {
  return vpcName;
};

export const getVpcFullName = () => {
  return `${vpcStackName}/${vpcName}`;
};

export const getRdsStackName = () => {
  return rdsStackName;
};

export const getRdsName = () => {
  return rdsName;
};

export const getRdsDatabaseName = () => {
  return process.env.RDS_DATABASE_NAME || "";
};

export const getRdsUsername = () => {
  return process.env.RDS_USERNAME || "";
};

export const getRdsFullName = () => {
  return `${rdsStackName}/${rdsName}`;
};

export const getRdsPassword = () => {
  return process.env.RDS_PASSWORD || "";
};

export const getPostgresqlPort = () => {
  return POSTGRESQL_PORT;
};

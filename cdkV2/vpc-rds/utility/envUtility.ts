import * as dotenv from "dotenv";

dotenv.config();

export class EnvUtility {
  static #vpcStackName = "VpcStack";
  static #vpcName = "CustomVpc";

  static #rdsStackName = "RdsStack";
  static #rdsName = "CustomRds";

  static #POSTGRESQL_PORT = 5432;

  static getCdkDefaultAccount = () => {
    return process.env.CDK_DEFAULT_ACCOUNT || "";
  };

  static getCdkDefaultRegion = () => {
    return process.env.CDK_DEFAULT_REGION || "";
  };

  static getEnv = () => {
    return {
      account: this.getCdkDefaultAccount(),
      region: this.getCdkDefaultRegion(),
    };
  };

  static getVpcStackName = () => {
    return this.#vpcStackName;
  };

  static getVpcName = () => {
    return this.#vpcName;
  };

  static getVpcFullName = () => {
    return `${this.#vpcStackName}/${this.#vpcName}`;
  };

  static getRdsStackName = () => {
    return this.#rdsStackName;
  };

  static getRdsName = () => {
    return this.#rdsName;
  };

  static getRdsDatabaseName = () => {
    return process.env.RDS_DATABASE_NAME || "";
  };

  static getRdsUsername = () => {
    return process.env.RDS_USERNAME || "";
  };

  static getRdsFullName = () => {
    return `${this.#rdsStackName}/${this.#rdsName}`;
  };

  static getRdsPassword = () => {
    return process.env.RDS_PASSWORD || "";
  };

  static getPostgresqlPort = () => {
    return this.#POSTGRESQL_PORT;
  };
}

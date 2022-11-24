export const getRepositoryArn = () => {
  return process.env.REPOSITORY_ARN ? process.env.REPOSITORY_ARN : "";
};

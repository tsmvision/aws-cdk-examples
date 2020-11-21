import * as AWS from "aws-sdk";

/**
 * generate body
 * [
 *  [
 *    {[columnName]: [columnData]},
 *    {[columnName]: [columnData]},
 *    {...}
 *  ],
 * ...
 * ]
 * @param columnMetaData
 * @param records
 */
const getBody = (
  columnMetaData: AWS.RDSDataService.Metadata = [],
  records: AWS.RDSDataService.SqlRecords = []
) => {
  if (columnMetaData.length === 0 || records.length === 0) {
    return [];
  }

  const result = [];
  for (let record of records) {
    const newRecord = [];
    for (let i = 0; i < record.length; i++) {
      const key = (columnMetaData[i] && columnMetaData[i].label) || "";
      newRecord.push({
        [key]: Object.values(record[i])[0],
      });
    }
    result.push(newRecord);
  }
  return result;
};

export const handler = async () => {
  const sqlParams = {
    resourceArn: process.env.CLUSTER_ARN || "",
    secretArn: process.env.SECRET_ARN || "",
    sql: "SELECT * FROM northwind.Customers LIMIT 2;",
    includeResultMetadata: true,
  };
  const db = new AWS.RDSDataService();
  try {
    const { columnMetadata, records } = await db
      .executeStatement(sqlParams)
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify([...getBody(columnMetadata, records)]),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 200,
      body: [[{}]],
    };
  }
};

import * as AWS from "aws-sdk";

// /**
//  * return necessary elements from columnMetadata only
//  * @param columnMetadata
//  */
// const getSanitizedColumnMetadata = (
//   columnMetadata: AWS.RDSDataService.Metadata
// ) => {
//   return columnMetadata.map(({ label, typeName }) => {
//     return {
//       label,
//       typeName,
//     };
//   });
// };

// /**
//  * return cleaner data from records
//  * @param records
//  */
// const getSanitizedRecords = (records: AWS.RDSDataService.SqlRecords) => {
//   const returnData = [];

//   for (let record of records) {
//     let result = record.map((element) => Object.values(element)[0]);
//     returnData.push(result);
//   }

//   return returnData;
// };

// const getSanitizedColumnMetadata2 = (
//   columnMetadata: AWS.RDSDataService.Metadata
// ) => {
//   return columnMetadata.map(({ label }) => label);
// };

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
    return {
      columnMetaData: [],
      records: [],
    };
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
    sql: "SELECT * FROM northwind.Customers LIMIT 1;",
    includeResultMetadata: true,
  };
  const db = new AWS.RDSDataService();
  try {
    const { columnMetadata, records } = await db
      .executeStatement(sqlParams)
      .promise();

    // const columnData = columnMetadata
    //   ? getSanitizedColumnMetadata(columnMetadata)
    //   : [];

    // const recordData = records ? getSanitizedRecords(records) : [];

    return {
      statusCode: 200,
      body: JSON.stringify({
        ...getBody(columnMetadata, records),
      }),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 200,
      body: "error",
    };
  }
};

export interface IRequest {
  pk: string;
  sk: string;
  message: string;
}

export interface IDynamodbPutRequest {
  PutRequest: {
    Item: {
      pk: {
        S: string;
      };
      sk: {
        S: string;
      };
      message: {
        S: string;
      };
    };
  };
}

export interface IParam {
  RequestItems: {
    [tableName: string]: IDynamodbPutRequest[];
  };
}

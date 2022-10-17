export const handler = async (event: any, context: any) => {
  const body = JSON.parse(event.body);
  return {
    statusCode: 200,
    body: JSON.stringify({
      method: event.httpMethod,
      message: body,
    }),
  };
};

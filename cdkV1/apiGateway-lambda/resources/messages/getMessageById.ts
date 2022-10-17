import { messages } from "./index";

export const handler = async (event: any) => {
  const messageId = JSON.parse(event.pathParameters.message_id);
  const message = messages[Number(messageId)];
  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
    }),
  };
};

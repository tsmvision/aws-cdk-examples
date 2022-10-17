import { messages } from "./index";

export const handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      messages,
    }),
  };
};

export const formatErrorMessage = (message: string | string[]) => {
  if (Array.isArray(message)) return message.join(',');

  return message;
};

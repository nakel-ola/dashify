export const axiosFormatError = (error: any): string => {
  if (error.response) return error.response.data.message;

  return error.message;
};

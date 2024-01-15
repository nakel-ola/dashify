export const AxiosThrowError = (error: any) => {
  if (error.response) throw new Error(error.response.data.message);

  throw new Error(error.message);
};

export type SubErrorToMap<T extends number | string> = {
  [property in T]: {
    errorCode: string;
    message: string;
  };
};

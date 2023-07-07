export const createQueryString = (params: Record<string, any>) => {
  const query = new URLSearchParams();

  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      if (params[key] === undefined || params[key] === null) continue;

      query.append(key, params[key]);
    }
  }

  return query.toString();
};

export const parseQueryString = (query: string) => {
  const params = new URLSearchParams(query);
  const result: Record<string, any> = {};

  for (const [key, value] of params.entries()) {
    result[key] = value;
  }

  return result;
};

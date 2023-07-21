export const success = (res, data) => {
  res.status(200).json({ status: 200, message: 'Success', data });
};

export const created = (res, data) => {
  res.status(201).json({ status: 201, message: 'Created', data });
};

export const error = (res, error, code = 500) => {
  res.status(code).json({ code, message: 'An error occurred', error });
};

export const fail = (res, error) => {
  res.status(501).json({ status: 501, message: 'Fail', error });
};

export const forbidden = (res, error) => {
  res.status(403).json({ status: 403, message: 'Forbidden', error });
};

export const unauthorized = (res, error) => {
  res.status(401).json({ status: 401, message: 'Unauthorized', error });
};

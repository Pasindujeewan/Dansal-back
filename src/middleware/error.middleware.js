const errorMiddleware = (err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    success: false,

    statusCode: err.statusCode || 500,

    message: err.message,

    code: err.code || null,

    data: null,
  });
};

export default errorMiddleware;

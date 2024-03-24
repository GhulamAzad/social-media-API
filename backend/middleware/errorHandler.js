const ErrorHandler = (err, req, res, next) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Internal server error";

  if (errMsg === "Unauthenticated") {
    errStatus = 401;
  }

  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
  });
};

export default ErrorHandler;

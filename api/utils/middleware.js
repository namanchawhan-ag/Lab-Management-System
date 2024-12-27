const firstMiddleware = (req, res, next) => {
  console.log("I am in the first middlware");
  console.log("---");
  console.log("Method: ", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
};

const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};
const middleware = { errorHandlerMiddleware, firstMiddleware };

export default middleware;


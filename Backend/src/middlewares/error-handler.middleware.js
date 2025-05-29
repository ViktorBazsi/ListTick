import HttpError from "../utils/HttpError.js";

const errorHandler = (err, req, res) => {
  if (err instanceof HttpError)
    return res.status(err.status).json({ error: err.message });
  console.error("Internal Server Error", err);
  return res.status(500).json({ error: "Internal Server Error" });
  // return next;
};

export default errorHandler;

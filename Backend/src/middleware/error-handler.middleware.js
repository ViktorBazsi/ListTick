import HttpError from "../utils/HttpError.js";

const errorHandler = (err, req, res, next) => {
  // Logolás fejlesztéshez
  console.error("Hiba történt:", err);

  // Alapértelmezett státusz
  const status = err.status || 500;

  // Ha az Error objektumban van 'message', azt küldjük vissza
  return res.status(status).json({
    message: err.message || "Ismeretlen hiba történt",
  });
};

export default errorHandler;

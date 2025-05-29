import express, { json } from "express";
import errorHandler from "./middlewares/error-handler.middleware.js";

const app = express();

app.use(json());

app.use(errorHandler);

export default app;

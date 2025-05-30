import express, { json } from "express";
import errorHandler from "./middleware/error-handler.middleware.js";

// AUTH
import authRoutes from "./routes/auth.routes.js";
// ROUTES
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(express.json());

// AUTHENTICATE
app.use("/auth", authRoutes);
// ROUTES
app.use("/api/user", userRoutes);

app.use(errorHandler);

export default app;

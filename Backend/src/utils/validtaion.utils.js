import prisma from "../models/prisma-client.js";
import HttpError from "./HttpError.js";
import jwt from "jsonwebtoken";

// USER
export const isValidUserId = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) throw new HttpError("user id nem található!", 404);
  return user;
};

export const isValidUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) throw new HttpError("username nem található!", 404);
  return user;
};

// GET USERID FROM TOKEN
export const extractUserIdFromToken = (req, JWT_SECRET) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new HttpError("Token hiányzik", 401);
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    return decodedToken.id;
  } catch (error) {
    throw new HttpError("Érvénytelen token", 401);
  }
};

// HOUSEHOLD
export const isValidHouseholdId = async (id) => {
  const household = await prisma.household.findUnique({
    where: { id },
  });
  if (!household) throw new HttpError("household id nem található!", 404);
  return household;
};

import userService from "../services/user.service.js";
import { JWT_SECRET } from "../constants/constants.js";
import HttpError from "../utils/HttpError.js";
import { extractUserIdFromToken } from "../utils/validtaion.utils.js";

const create = async (req, res, next) => {
  const { username, email, password, lastName, firstName } = req.body;
  try {
    const newUser = await userService.create({
      username,
      email,
      password,
      lastName,
      firstName,
    });
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const allUsers = await userService.list();
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const userById = await userService.getById(id);
    res.status(200).json(userById);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { username, email, password, lastName, firstName, isAdmin } = req.body;

  let userId = extractUserIdFromToken(req, JWT_SECRET);
  if (id != userId) {
    return next(new HttpError("Csak a saját profilodat módosíthatod", 401));
  }

  try {
    const updatedUser = await userService.update(id, {
      username,
      email,
      password,
      lastName,
      firstName,
      isAdmin,
    });
    res.status(201).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  const { id } = req.params;

  let userId = extractUserIdFromToken(req, JWT_SECRET);
  if (id != userId) {
    return next(new HttpError("Csak a saját profilodat törölheted", 401));
  }

  try {
    const deletedUser = await userService.destroy(id);
    res.status(200).json({ deletedUser });
  } catch (error) {
    next(error);
  }
};

export default {
  create,
  list,
  getById,
  update,
  destroy,
};

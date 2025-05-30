import householdService from "../services/household.service.js";
import HttpError from "../utils/HttpError.js";

const create = async (req, res, next) => {
  const { name, address } = req.body;
  const userId = req.user?.id;

  if (!userId)
    return next(new HttpError("Nincs bejelentkezett felhasználó", 401));

  try {
    const newHousehold = await householdService.create({
      name,
      address,
      userId,
    });
    res.status(201).json(newHousehold);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const allHouseholds = await householdService.list();
    res.status(200).json(allHouseholds);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const householdById = await householdService.getById(id);
    res.status(200).json(householdById);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { name, address } = req.body;
  const userId = req.user?.id;

  try {
    const isMember = await householdService.isUserInHousehold(id, userId);
    if (!isMember) {
      return next(
        new HttpError(
          "Csak olyan household-ot módosíthatsz, amelynek tagja vagy",
          403
        )
      );
    }

    const updatedHousehold = await householdService.update(id, {
      name,
      address,
    });
    res.status(201).json(updatedHousehold);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const isMember = await householdService.isUserInHousehold(id, userId);
    if (!isMember) {
      return next(
        new HttpError(
          "Csak olyan household-ot törölhetsz, amelynek tagja vagy",
          403
        )
      );
    }

    const deletedHousehold = await householdService.destroy(id);
    res.status(200).json({ deletedHousehold });
  } catch (error) {
    next(error);
  }
};

// EXTRÁK
const join = async (req, res, next) => {
  const { id } = req.params; // householdId
  const userId = req.user?.id;

  try {
    const result = await householdService.joinHousehold(id, userId);
    res.status(200).json({ message: "Csatlakoztál a householdhoz", result });
  } catch (error) {
    next(error);
  }
};

const leave = async (req, res, next) => {
  const { id } = req.params; // householdId
  const userId = req.user?.id;

  try {
    const result = await householdService.leaveHousehold(id, userId);
    res.status(200).json({ message: "Kiléptél a householdból", result });
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
  join,
  leave,
};

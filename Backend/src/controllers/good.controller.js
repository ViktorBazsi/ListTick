import goodService from "../services/good.service.js";


const create = async (req, res, next) => {
  const { name, expiration, price, shop, householdId, status } = req.body;
  const userId = req.user?.id;

  try {
    const newGood = await goodService.create({
      name,
      expiration,
      price,
      shop,
      householdId,
      userId,
      status,
    });
    res.status(201).json(newGood);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const allGoods = await goodService.list();
    res.status(200).json(allGoods);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const goodById = await goodService.getById(id);
    res.status(200).json(goodById);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  const { name, expiration, price, shop, status } = req.body;
  const userId = req.user?.id;

  try {
    const updatedGood = await goodService.update(
      id,
      { name, expiration, price, shop, status },
      userId
    );
    res.status(201).json(updatedGood);
  } catch (error) {
    next(error);
  }
};

const destroy = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const deletedGood = await goodService.destroy(id, userId);
    res.status(200).json({ deletedGood });
  } catch (error) {
    next(error);
  }
};

// EXTRA
const listByHousehold = async (req, res, next) => {
  const { householdId } = req.params;

  try {
    const goods = await goodService.listByHouseholdId(householdId);
    res.status(200).json(goods);
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
  listByHousehold,
};

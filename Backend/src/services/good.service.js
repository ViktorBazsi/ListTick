import prisma from "../models/prisma-client.js";
import HttpError from "../utils/HttpError.js";
import { isValidHouseholdId } from "../utils/validtaion.utils.js";
import goodQueryFilter from "../utils/goodQueryFilter.js";

const create = async ({
  name,
  expiration,
  price,
  shop,
  householdId,
  userId,
  status,
  type,
}) => {
  const household = await prisma.household.findUnique({
    where: { id: householdId },
    include: { users: true },
  });

  if (!household) {
    throw new HttpError("Household nem található", 404);
  }

  const isMember = household.users.some((u) => u.id === userId);
  if (!isMember) {
    throw new HttpError("Nem vagy tagja ennek a householdnak", 403);
  }

  const newGood = await prisma.good.create({
    data: {
      name,
      expiration,
      price,
      shop,
      householdId,
      status,
      type,
    },
  });

  return newGood;
};

// const list = async () => {
//   const allGoods = await prisma.good.findMany();
//   return allGoods;
// };

const list = async (query) => {
  const prismaQuery = goodQueryFilter(query);

  const total = await prisma.good.count({ where: prismaQuery.where });
  const goods = await prisma.good.findMany(prismaQuery);

  return {
    total,
    page: Number(query.page || 1),
    pageSize: Number(query.pageSize || 10),
    goods,
  };
};

const getById = async (id) => {
  const goodById = await prisma.good.findUnique({
    where: { id },
  });
  return goodById;
};

const update = async (id, userData, userId) => {
  const good = await prisma.good.findUnique({
    where: { id },
    include: {
      household: {
        include: { users: true },
      },
    },
  });

  if (!good) {
    throw new HttpError("A termék nem található", 404);
  }

  const isMember = good.household.users.some((u) => u.id === userId);
  if (!isMember) {
    throw new HttpError(
      "Nem módosíthatod ezt a terméket, nem vagy a household tagja",
      403
    );
  }

  const updatedGood = await prisma.good.update({
    where: { id },
    data: userData,
  });

  return updatedGood;
};

const destroy = async (id, userId) => {
  const good = await prisma.good.findUnique({
    where: { id },
    include: {
      household: {
        include: { users: true },
      },
    },
  });

  if (!good) {
    throw new HttpError("A termék nem található", 404);
  }

  const isMember = good.household.users.some((u) => u.id === userId);
  if (!isMember) {
    throw new HttpError(
      "Nem törölheted ezt a terméket, nem vagy a household tagja",
      403
    );
  }

  const deletedGood = await prisma.good.delete({
    where: { id },
  });

  return deletedGood;
};

// EXTRA
// const listByHouseholdId = async (householdId) => {
//   await isValidHouseholdId(householdId);
//   const goods = await prisma.good.findMany({
//     where: { householdId },
//     orderBy: { name: "asc" }, // ha akarod, rendezve is jöhet
//   });

//   return goods;
// };

const listByHouseholdId = async (householdId, query = {}) => {
  await isValidHouseholdId(householdId);

  // hozzáadjuk a householdId-t a query-hez
  const prismaQuery = goodQueryFilter({ ...query, householdId });

  const total = await prisma.good.count({ where: prismaQuery.where });
  const goods = await prisma.good.findMany(prismaQuery);

  return {
    total,
    page: Number(query.page || 1),
    pageSize: Number(query.pageSize || 10),
    goods,
  };
};

export default {
  create,
  list,
  getById,
  update,
  destroy,
  listByHouseholdId,
};

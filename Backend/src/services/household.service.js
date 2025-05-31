import prisma from "../models/prisma-client.js";
import HttpError from "../utils/HttpError.js";
import { isValidHouseholdId } from "../utils/validtaion.utils.js";
import householdQueryFilter from "../utils/householdQueryFilter.js";

const create = async ({ name, address, userId }) => {
  const newHousehold = await prisma.household.create({
    data: {
      name,
      address,
      users: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return newHousehold;
};

// const list = async () => {
//   const allHouseholds = await prisma.household.findMany({
//     include: {
//       users: true,
//       goods: true,
//     },
//   });
//   return allHouseholds;
// };

const list = async (query = {}) => {
  const { skip, take, where } = householdQueryFilter(query);

  const [data, totalCount] = await Promise.all([
    prisma.household.findMany({
      skip,
      take,
      where,
      include: {
        users: true,
        goods: true,
      },
    }),
    prisma.household.count({ where }), // ugyanazzal a where-rel!
  ]);

  return {
    data,
    totalCount,
  };
};

// const getById = async (id) => {
//   const householdById = await prisma.household.findUnique({
//     where: { id },
//     include: {
//       users: true,
//       goods: true,
//     },
//   });
//   return householdById;
// };

const getById = async (id, userId) => {
  const household = await prisma.household.findUnique({
    where: { id },
    include: {
      users: {
        select: { id: true, firstName: true, lastName: true, username: true },
      },
    },
  });

  if (!household) throw new HttpError("Háztartás nem található", 404);

  const isMember = household.users.some((user) => user.id === userId);

  if (isMember) {
    const goods = await prisma.good.findMany({
      where: { householdId: id },
    });
    return { ...household, goods };
  }

  return {
    ...household,
    goods: null,
    message:
      "Nem vagy tagja ennek a háztartásnak, ezért nem látod az ide tartozó árukat.",
  };
};

const update = async (id, userData) => {
  await isValidHouseholdId(id);
  const updatedHousehold = await prisma.household.update({
    where: { id },
    data: { ...userData },
  });
  return updatedHousehold;
};

const destroy = async (id) => {
  await isValidHouseholdId(id);
  const deletedHousehold = await prisma.household.delete({
    where: { id },
  });
  return deletedHousehold;
};

// EXTRÁK
const joinHousehold = async (householdId, userId) => {
  const household = await prisma.household.findUnique({
    where: { id: householdId },
    include: { users: true },
  });

  if (!household) {
    throw new HttpError("Household nem található", 404);
  }

  const isAlreadyMember = household.users.some((user) => user.id === userId);
  if (isAlreadyMember) {
    throw new HttpError("Már tagja vagy ennek a householdnak", 400);
  }

  const updatedHousehold = await prisma.household.update({
    where: { id: householdId },
    data: {
      users: {
        connect: { id: userId },
      },
    },
  });

  return updatedHousehold;
};

const leaveHousehold = async (householdId, userId) => {
  const household = await prisma.household.findUnique({
    where: { id: householdId },
    include: { users: true },
  });

  if (!household) {
    throw new HttpError("Household nem található", 404);
  }

  const isMember = household.users.some((user) => user.id === userId);
  if (!isMember) {
    throw new HttpError("Nem vagy tagja ennek a householdnak", 400);
  }

  const updatedHousehold = await prisma.household.update({
    where: { id: householdId },
    data: {
      users: {
        disconnect: { id: userId },
      },
    },
  });

  return updatedHousehold;
};

const isUserInHousehold = async (householdId, userId) => {
  const household = await prisma.household.findUnique({
    where: { id: householdId },
    include: { users: true },
  });

  if (!household) {
    throw new HttpError("A household nem található", 404);
  }

  const isMember = household.users.some((user) => user.id === userId);
  return isMember;
};

const getHouseholdsByUserId = async (userId) => {
  return await prisma.household.findMany({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
  });
};

export default {
  create,
  list,
  getById,
  update,
  destroy,
  joinHousehold,
  leaveHousehold,
  isUserInHousehold,
  getHouseholdsByUserId,
};

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
        users: {
          select: { id: true, firstName: true, lastName: true, username: true },
        },
        goods: true,
        reqUsers: {
          select: {
            user: {
              select: { id: true },
            },
          },
        },
      },
    }),
    prisma.household.count({ where }),
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
      users: true,
      reqUsers: {
        include: {
          user: true,
        },
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

const destroy = async (id, userId) => {
  await isValidHouseholdId(id);

  // Ellenőrizd, hogy az adott user tagja-e
  const household = await prisma.household.findUnique({
    where: { id },
    include: {
      users: { select: { id: true } },
    },
  });

  if (!household) {
    throw new HttpError("Háztartás nem található", 404);
  }

  const isMember = household.users.some((user) => user.id === userId);
  if (!isMember) {
    throw new HttpError(
      "Csak olyan háztartást törölhetsz, amelynek tagja vagy",
      403
    );
  }

  if (household.users.length > 1) {
    throw new HttpError(
      "A háztartás csak akkor törölhető, ha te vagy az utolsó tag",
      400
    );
  }

  // Töröljük a goods-okat, ha vannak
  await prisma.good.deleteMany({
    where: { householdId: id },
  });

  // Majd a household-ot
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

const requestJoinHousehold = async (householdId, userId) => {
  const household = await prisma.household.findUnique({
    where: { id: householdId },
    include: {
      users: true,
      reqUsers: {
        where: { userId },
      },
    },
  });

  if (!household) {
    throw new HttpError("Household nem található", 404);
  }

  const isAlreadyMember = household.users.some((user) => user.id === userId);
  if (isAlreadyMember) {
    throw new HttpError("Már tagja vagy ennek a householdnak", 400);
  }

  const hasRequested = household.reqUsers.length > 0;
  if (hasRequested) {
    throw new HttpError("Már beküldtél csatlakozási kérelmet", 400);
  }

  const joinRequest = await prisma.householdJoinRequest.create({
    data: {
      userId,
      householdId,
    },
  });

  return joinRequest;
};

const approveJoinRequest = async (householdId, userIdToApprove, approverId) => {
  const household = await prisma.household.findUnique({
    where: { id: householdId },
    include: { users: true },
  });

  if (!household) {
    throw new HttpError("Household nem található", 404);
  }

  const isApproverMember = household.users.some(
    (user) => user.id === approverId
  );
  if (!isApproverMember) {
    throw new HttpError("Csak household tag hagyhat jóvá kérelmet", 403);
  }

  const request = await prisma.householdJoinRequest.findUnique({
    where: {
      userId_householdId: {
        userId: userIdToApprove,
        householdId,
      },
    },
  });

  if (!request) {
    throw new HttpError("Nincs ilyen csatlakozási kérelem", 404);
  }

  // Csatlakoztatás
  await prisma.household.update({
    where: { id: householdId },
    data: {
      users: {
        connect: { id: userIdToApprove },
      },
    },
  });

  // Kérelem törlése
  await prisma.householdJoinRequest.delete({
    where: {
      userId_householdId: {
        userId: userIdToApprove,
        householdId,
      },
    },
  });

  return { approvedUserId: userIdToApprove, householdId };
};

const rejectJoinRequest = async (householdId, userId, approverId) => {
  const household = await prisma.household.findUnique({
    where: { id: householdId },
    include: { users: true },
  });

  if (!household) {
    throw new HttpError("Household nem található", 404);
  }

  const isApproverMember = household.users.some((u) => u.id === approverId);
  if (!isApproverMember) {
    throw new HttpError("Csak household tag utasíthat el kérelmet", 403);
  }

  const request = await prisma.householdJoinRequest.findUnique({
    where: {
      userId_householdId: {
        userId,
        householdId,
      },
    },
  });

  if (!request) {
    throw new HttpError("Nincs ilyen csatlakozási kérelem", 404);
  }

  await prisma.householdJoinRequest.delete({
    where: {
      userId_householdId: {
        userId,
        householdId,
      },
    },
  });

  return { rejectedUserId: userId, householdId };
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
  requestJoinHousehold,
  approveJoinRequest,
  rejectJoinRequest,
};

// export default function householdQueryFilter(query = {}) {
//   const { page = 1, pageSize = 2, search } = query;

//   const where = search
//     ? {
//         name: {
//           contains: search,
//           mode: "insensitive", // kis-nagybetű független keresés
//         },
//       }
//     : {};

//   return {
//     skip: (Number(page) - 1) * Number(pageSize),
//     take: Number(pageSize),
//     where,
//   };
// }

export default function householdQueryFilter(query = {}) {
  const {
    page = 1,
    pageSize = 10,
    search,
    userId,
    onlyMembers,
    onlyNotMembers,
  } = query;

  const where = {};

  // 🔍 Keresés név alapján
  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  // 👥 Szűrés tagság szerint
  if (onlyMembers && userId) {
    where.users = {
      some: {
        id: userId,
      },
    };
  }

  if (onlyNotMembers && userId) {
    where.users = {
      none: {
        id: userId,
      },
    };
  }

  return {
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize),
    where,
  };
}

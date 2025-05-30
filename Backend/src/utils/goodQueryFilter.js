export default function goodQueryFilter(query = {}) {
  const {
    page = 1,
    pageSize = 10,
    search,
    status,
    type,
    householdId,
    orderBy = "name",
    sort = "asc",
  } = query;

  const where = {
    ...(householdId && { householdId }),
    ...(status && { status }),
    ...(type && { type }),
    ...(search && {
      name: {
        contains: search,
        mode: "insensitive",
      },
    }),
  };

  const filter = {
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize),
    where,
    orderBy: { [orderBy]: sort },
  };

  return filter;
}

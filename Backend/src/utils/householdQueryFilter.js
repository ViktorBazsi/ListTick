export default function householdQueryFilter(query = {}) {
  const { page = 1, pageSize = 2, search } = query;

  const where = search
    ? {
        name: {
          contains: search,
          mode: "insensitive", // kis-nagybetű független keresés
        },
      }
    : {};

  return {
    skip: (Number(page) - 1) * Number(pageSize),
    take: Number(pageSize),
    where,
  };
}

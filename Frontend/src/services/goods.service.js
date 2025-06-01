import axiosInstance from "./axiosInstance";

const getByHousehold = async (householdId) => {
  const response = await axiosInstance.get(
    `/api/good/by-household/${householdId}`
  );
  return response.data;
};

const getByHouseholdFiltered = async ({
  householdId,
  page = 1,
  pageSize = 10,
  search = "",
  status = "",
  type = "",
  orderBy = "name",
  sort = "asc",
}) => {
  const params = {
    page,
    pageSize,
    search,
    status,
    type,
    orderBy,
    sort,
  };

  const response = await axiosInstance.get(
    `/api/good/by-household/${householdId}`,
    { params }
  );

  return response.data;
};

const createGood = async (data) => {
  const response = await axiosInstance.post("/api/good", data);
  return response.data;
};

const updateGood = async (id, data) => {
  const response = await axiosInstance.put(`/api/good/${id}`, data);
  return response.data;
};

const getById = async (id) => {
  const response = await axiosInstance.get(`/api/good/${id}`);
  return response.data;
};

export default {
  getByHousehold,
  createGood,
  updateGood,
  getById,
  getByHouseholdFiltered,
};

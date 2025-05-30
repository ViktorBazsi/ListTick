import axiosInstance from "./axiosInstance";

const getMyHouseholds = async () => {
  const response = await axiosInstance.get("/api/household/my");
  return response.data;
};

const createHousehold = async (data) => {
  const response = await axiosInstance.post("/api/household", data);
  return response.data;
};

const getById = async (id) => {
  const response = await axiosInstance.get(`/api/household/${id}`);
  return response.data;
};

export default {
  getMyHouseholds,
  createHousehold,
  getById,
};

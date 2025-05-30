import axiosInstance from "./axiosInstance";

const getByHousehold = async (householdId) => {
  const response = await axiosInstance.get(
    `/api/good/by-household/${householdId}`
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
};

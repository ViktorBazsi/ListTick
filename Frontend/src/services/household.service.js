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

const getAll = async (page = 1, pageSize = 10, search = "", filters = {}) => {
  const params = {
    page,
    pageSize,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  if (filters.onlyMembers) {
    params.onlyMembers = true;
  }

  if (filters.onlyNotMembers) {
    params.onlyNotMembers = true;
  }

  const response = await axiosInstance.get("/api/household", { params });
  return response.data;
};

const joinHousehold = async (householdId) => {
  const response = await axiosInstance.put(
    `/api/household/${householdId}/join`
  );
  return response.data;
};

const approveUser = async (householdId, userId) => {
  const response = await axiosInstance.put(
    `/api/household/${householdId}/approve-user/${userId}`
  );
  return response.data;
};

const rejectUser = async (householdId, userId) => {
  const response = await axiosInstance.put(
    `/api/household/${householdId}/reject-user/${userId}`
  );
  return response.data;
};

const leaveHousehold = async (householdId) => {
  const response = await axiosInstance.put(
    `/api/household/${householdId}/leave`
  );
  return response.data;
};

const deleteHousehold = async (householdId) => {
  const response = await axiosInstance.delete(`/api/household/${householdId}`);
  return response.data;
};

export default {
  getMyHouseholds,
  createHousehold,
  getById,
  getAll,
  joinHousehold,
  approveUser,
  rejectUser,
  leaveHousehold,
  deleteHousehold,
};

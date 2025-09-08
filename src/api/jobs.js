import client from "./client";

// 🔹 Jobs list (with filters & search)
export const getJobs = async (params = {}) => {
  const res = await client.get("/jobs", { params });
  return res.data;
};

// 🔹 Single job details
export const getJobById = async (id) => {
  const res = await client.get(`/jobs/${id}`);
  return res.data;
};

// 🔹 Lookups
export const getLocations = async () => {
  const res = await client.get("/locations");
  return res.data;
};

export const getDepartments = async () => {
  const res = await client.get("/departments");
  return res.data;
};

export const getDivisions = async () => {
  const res = await client.get("/divisions");
  return res.data;
};

export const getFunctions = async () => {
  const res = await client.get("/functions");
  return res.data;
};

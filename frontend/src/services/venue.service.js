import { api } from "../api/client.js";

export const getVenues = async (page = 1) => {
  return await api.get(`/venues?page=${page}`);
};
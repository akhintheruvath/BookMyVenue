import { api } from "../api/client.js";

export const getVenues = async () => {
  const response = await api.get("/venues");
  return response.data;
}
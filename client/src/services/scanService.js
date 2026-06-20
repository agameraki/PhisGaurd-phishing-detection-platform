import axios from "axios";

const scanService = {
  scanEmail: async (subject, sender, content) => {
    const res = await axios.post("/api/scan", { subject, sender, content });
    return res.data;
  },

  getScan: async (id) => {
    const res = await axios.get(`/api/scan/${id}`);
    return res.data;
  },

  getHistory: async (page = 1, limit = 10) => {
    const res = await axios.get(`/api/history?page=${page}&limit=${limit}`);
    return res.data;
  },

  getScanDetail: async (id) => {
    const res = await axios.get(`/api/history/${id}`);
    return res.data;
  },

  deleteScan: async (id) => {
    const res = await axios.delete(`/api/history/${id}`);
    return res.data;
  },

  getStats: async () => {
    const res = await axios.get("/api/history/stats");
    return res.data;
  },
};

export default scanService;
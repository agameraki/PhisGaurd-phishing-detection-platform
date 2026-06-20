import axios from "axios";

const authService = {
  register: async (name, email, password) => {
    const res = await axios.post("/api/auth/register", {
      name,
      email,
      password,
    });
    return res.data;
  },

  login: async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    return res.data;
  },

  getMe: async () => {
    const res = await axios.get("/api/auth/me");
    return res.data;
  },
};

export default authService;
import axios from "axios";

const paymentService = {
  createOrder: async () => {
    const res = await axios.post("/api/payment/order");
    return res.data;
  },

  upgrade: async () => {
    const res = await axios.post("/api/payment/upgrade");
    return res.data;
  },

  getPaymentStatus: async () => {
    const res = await axios.get("/api/payment/status");
    return res.data;
  },
};

export default paymentService;
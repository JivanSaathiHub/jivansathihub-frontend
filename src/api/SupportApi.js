import API from "./axios";

const supportApi = {
  getMyTickets: async () => {
    const res = await API.get("/support/my");
    return res.data;
  },

  create: async (data) => {
    const res = await API.post("/support", data);
    return res.data;
  },
};

export default supportApi;
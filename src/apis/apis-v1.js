import axios from "axios";
import { isAuth } from "../auth";

let api = axios.create({
  baseURL: "http://localhost:9999/apis/v1",
  withCredentials: true,
});

api.interceptors.request.use(
  async function (config) {
    let [auth, token] = await isAuth();

    if (auth) {
      config.headers.authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;

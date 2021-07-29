import axios from "axios";
import { isAuth } from "../auth";

let api = axios.create({
  baseURL: `${process.env.REACT_APP_backend_link || ""}/apis/v1`,
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

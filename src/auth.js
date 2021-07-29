import axios from "axios";
import jwt from "jsonwebtoken";

let accessToken = "";

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

export const getNewAccessToken = async () => {
  let api = axios.create({
    baseURL: `${process.env.REACT_APP_backend_link || ""}/apis/v1`,
  });
  let token = await api.get("/refresh", {
    withCredentials: true,
  });
  setAccessToken(token.data.accessToken);
  return accessToken;
};

export const isAuth = async () => {
  let token = getAccessToken();
  let auth = false;
  let newToken = "";
  if (token !== "") {
    try {
      let { exp } = jwt.decode(token);
      if (!exp || Date.now() >= exp * 1000) {
        newToken = await getNewAccessToken();
        if (newToken !== "") {
          auth = true;
        }
      } else {
        auth = true;
      }
    } catch (e) {
      console.log(e);
      setAccessToken("");
      return [auth, getAccessToken()];
    }
  } else {
    newToken = await getNewAccessToken();
    if (newToken !== "") {
      auth = true;
    }
  }
  return [auth, getAccessToken()];
};

export const getTokenData = () => {
  try {
    let data = jwt.decode(getAccessToken());
    return data || {};
  } catch (e) {
    return {};
  }
};

export const currAuth = () => {
  try {
    let { exp } = jwt.decode(accessToken);
    if (!exp || Date.now() >= exp * 1000) {
      return false;
    }
  } catch (e) {
    return false;
  }

  return true;
};

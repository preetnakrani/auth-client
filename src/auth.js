import axios from "axios";
import jwt from "jsonwebtoken";

let accessToken = "";

export let setAccessToken = (token) => {
  accessToken = token;
};

export let getAccessToken = () => {
  return accessToken;
};

export let getNewAccessToken = async () => {
  let api = axios.create({ baseURL: "http://localhost:9999/apis/v1" });
  let token = await api.get("/refresh", {
    withCredentials: true,
  });
  setAccessToken(token.data.accessToken);
  return accessToken;
};

export let isAuth = async () => {
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
      console.log("here at isAuth");
      console.log(Object.keys(e));
      console.log(e);
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

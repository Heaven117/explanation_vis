import _ from "lodash";
import axios from "axios";

const instance = axios.create({
  timeout: 10000,
  headers: { "Content-Type": "application/json;charset=UTF-8" },
});

export const api = (url, params = {}, method = "GET") => {
  if (typeof params !== "object") {
    params = { params: params };
  }
  switch (method) {
    case "GET": {
      return instance
        .get(url, { params: params })
        .then((res) => {
          if (res.data) {
            console.log(url, res.data);
            return res.data;
          } else throw Error(res);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    case "POST": {
      return instance
        .post(url, JSON.stringify(params))
        .then((res) => {
          if (res.data) {
            console.log(url, res.data);
            return res.data;
          } else throw Error(res);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    default:
      return null;
  }
};

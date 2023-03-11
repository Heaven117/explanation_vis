import _ from "lodash";
import axios from "axios";

const instance = axios.create({
  timeout: 1000,
  headers: { "Content-Type": "application/json;charset=UTF-8" },
});

export const api = (url, params = {}, method = "GET") => {
  if (typeof params !== "object") {
    params = { params: params };
  }
  switch (method) {
    case "GET": {
      return instance.get(url, { params: params }).then(function (res) {
        console.log(res);
      });
    }
    case "POST": {
      return instance.post(url, { params: params }).then(function (res) {
        console.log(res);
      });
    }
  }
};

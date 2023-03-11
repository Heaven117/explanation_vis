import React, { useEffect } from "react";
import InfluHeatmap from "./components/influence";
import MenuBar from "./components/menu/index";
import "./index.scss";
import { api } from "./service/request";
import { useReducerContext } from "./service/store";
// @ts-nocheck # 忽略全文

function App() {
  const {
    state: { count },
    dispatch,
  } = useReducerContext();

  useEffect(() => {
    api("/getAllData").then((res: any) => {
      console.log(res);
      dispatch({ type: "setAllData", payload: res?.data });
    });
  }, []);

  return (
    <div className="App">
      <MenuBar />
      <div className="main-content">
        <InfluHeatmap />
      </div>
    </div>
  );
}

export default App;

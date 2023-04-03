import React, { useEffect, useState } from "react";
import MenuBar from "./mods/MenuBar";
import "./index.scss";
import { useReducerContext } from "./service/store";
import { api } from "./service/request";
import _ from "lodash";
import { MENU } from "./constants";
import LocalPage from "./mods/LocalPage";
import EditPage from "./mods/EditPage";

function App() {
  const { dispatch } = useReducerContext();
  const [menu, setMenu] = useState("edit");

  useEffect(() => {
    api("getDataLength").then((res) => {
      dispatch({ type: "settotalSample", payload: res });
    });
  }, []);

  return (
    <div className="App">
      <MenuBar menu={menu} setMenu={setMenu} />
      <div className="main-content">
        {menu === MENU.local && <LocalPage />}
        {menu === MENU.edit && <EditPage />}
      </div>
    </div>
  );
}

export default App;

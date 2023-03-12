import React, { useEffect, useState } from "react";
import MenuBar from "./mods/MenuBar";
import "./index.scss";
import { api } from "./service/request";
import { useReducerContext } from "./service/store";
import InstancePart from "./mods/Instance";
import InfluencePart from "./mods/Influence";
import { Button } from "antd";

function App() {
  const {
    state: { allData },
    dispatch,
  } = useReducerContext();
  const [openInfluencePart, setOpenInfluencePart] = useState(false);

  const showDrawer = () => {
    setOpenInfluencePart(true);
  };

  useEffect(() => {
    api("/getAllData").then((res: any) => {
      console.log(res);
      dispatch({ type: "setAllData", payload: res?.data });
    });
  }, [dispatch]);

  return (
    <div className="App">
      <MenuBar />
      <div className="main-content">
        <InstancePart />
        <Button type="primary" onClick={showDrawer}>
          Open
        </Button>
        <InfluencePart open={openInfluencePart} setOpen={setOpenInfluencePart} />
      </div>
    </div>
  );
}

export default App;

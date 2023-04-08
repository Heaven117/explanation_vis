import React, { useEffect, useState } from "react";
import MenuBar from "./pages/MenuBar";
import { Layout } from "antd";

import "./index.scss";
import { useReducerContext } from "./service/store";
import { api } from "./service/request";
import _ from "lodash";
import { MENU } from "./constants";
import LocalPage from "./pages/LocalPage";
import EditPage from "./pages/EditPage";

const { Content, Footer, Sider } = Layout;

function App() {
  const {
    state: { currentId },
    dispatch,
  } = useReducerContext();
  const [activeMenu, setActiveMenu] = useState(MENU.local);

  return (
    <Layout hasSider className="App">
      <Sider
        theme="light"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <MenuBar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      </Sider>
      <Layout
        className="site-layout"
        style={{ marginLeft: 200, background: "white" }}
      >
        <Content style={{ margin: "24px 50px", overflow: "initial" }}>
          {activeMenu === MENU.local && !_.isNil(currentId) && <LocalPage />}
          {activeMenu === MENU.edit && <EditPage />}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          提高用户信任度的机器学习解释系统 ©2023 Created by Heaven
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;

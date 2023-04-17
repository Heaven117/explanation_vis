import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PieChartOutlined,
  BarChartOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Menu, Input, Tag } from "antd";
import { useReducerContext } from "../service/store";
import { MENU } from "../constants";
import { api } from "../service/request";
import { List } from "antd";
import VirtualList from "rc-virtual-list";
import { isEmpty } from "lodash";
import { categoryTag, CAT_COLOR } from "../components/tags";
const { Search } = Input;

const ContainerHeight = 800;

const MenuBar = ({ activeMenu, setActiveMenu }) => {
  const {
    state: { currentId, modelInfo },
    dispatch,
  } = useReducerContext();
  const [data, setData] = useState([]);

  const items = [
    { key: MENU.title, label: "机器学习解释模型" },
    {
      key: MENU.global,
      label: "Global Explanation",
      icon: <PieChartOutlined />,
    },
    // { key: MENU.edit, label: "Edit Explanation", icon: <EditOutlined /> },
    {
      key: MENU.local,
      label: "Local Explanation",
      icon: <BarChartOutlined />,
    },
  ];

  const onClick = useCallback(
    (index) => {
      setActiveMenu(MENU.local);
      dispatch({ type: "setCurrentId", payload: index });
    },
    [dispatch]
  );
  const onSelect = useCallback(
    ({ item, key, keyPath, selectedKeys, domEvent }) => {
      setActiveMenu(key);
    },
    []
  );

  const onScroll = (e) => {
    if (
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      ContainerHeight
    ) {
      appendData();
    }
  };
  const appendData = () => {
    api("getPredData", {}).then((res) => {
      res.data && setData(data.concat(res?.data));
    });
  };
  const onSearch = (idx) => {
    idx = isEmpty(idx) ? undefined : idx;
    api("getPredData", { idx }).then((res) => {
      if (idx) setData([res.data]);
      else setData(res.data);
    });
  };

  useEffect(() => {
    appendData();
  }, []);

  return (
    <div className="menuBar">
      <Menu
        selectedKeys={activeMenu}
        mode="inline"
        items={items}
        onSelect={onSelect}
      />
      {activeMenu === MENU.local ? (
        <div className="sampleList">
          <Search
            placeholder="search sample id"
            onSearch={onSearch}
            enterButton
            allowClear
          />
          <List>
            <VirtualList
              data={data}
              height={ContainerHeight}
              itemHeight={47}
              itemKey="id"
              onScroll={onScroll}
            >
              {(sample, index) => (
                <List.Item>
                  <Button
                    className="sampleBtn"
                    type={
                      index === currentId && activeMenu === MENU.local
                        ? "primary"
                        : "dashed"
                    }
                    onClick={() => onClick(index)}
                  >
                    {sample.id}
                    {categoryTag(sample.category)}
                  </Button>
                </List.Item>
              )}
            </VirtualList>
          </List>
        </div>
      ) : (
        <div className="modelInfo">
          <h3>Model Summary</h3>
          <div>Accuracy: {Number(modelInfo?.acc * 100).toFixed(1)} %</div>
          <div>Loss: {Number(modelInfo?.loss).toFixed(2)}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <Tag className="modelInfo_icon" color={CAT_COLOR.TP}>
                {modelInfo.TP}
              </Tag>
              <Tag className="modelInfo_icon" color={CAT_COLOR.TN}>
                {modelInfo.TN}
              </Tag>
            </div>
            <div>
              <Tag className="modelInfo_icon" color={CAT_COLOR.FP}>
                {modelInfo.FP}
              </Tag>
              <Tag className="modelInfo_icon" color={CAT_COLOR.FN}>
                {modelInfo.FN}
              </Tag>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuBar;

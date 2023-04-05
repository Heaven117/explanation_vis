import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PieChartOutlined,
  BarChartOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Menu, Input } from "antd";
import { useReducerContext } from "@/service/store";
import { MENU } from "@/constants";
import { api } from "@/service/request";
import { List } from "antd";
import VirtualList from "rc-virtual-list";
import { isEmpty } from "lodash";
import { categoryTag } from "@/components/tags";
const { Search } = Input;

const ContainerHeight = 800;

const MenuBar = ({ activeMenu, setActiveMenu }) => {
  const {
    state: { currentId },
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
    { key: MENU.edit, label: "Edit Explanation", icon: <EditOutlined /> },
    {
      key: MENU.local,
      label: "Local Explanation",
      children: [],
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
      setData(data.concat(res.data));
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
        defaultSelectedKeys={["global"]}
        mode="inline"
        items={items}
        onSelect={onSelect}
      />
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
            {(sample) => (
              <List.Item>
                <Button
                  className="sampleBtn"
                  type={
                    sample.id === currentId && activeMenu === MENU.local
                      ? "primary"
                      : "dashed"
                  }
                  onClick={() => onClick(sample.id)}
                >
                  {sample.id}
                  {categoryTag(sample.category)}
                </Button>
              </List.Item>
            )}
          </VirtualList>
        </List>
      </div>
    </div>
  );
};

export default MenuBar;

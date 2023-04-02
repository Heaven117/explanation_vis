import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PieChartOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  EditOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import { Button, MenuProps, Menu, Input } from "antd";
import { useReducerContext } from "@/service/store";
import { MENU } from "@/constants";
import { api } from "@/service/request";
import { List } from "antd";
import VirtualList from "rc-virtual-list";
import { isEmpty } from "lodash";
import { categoryTag } from "@/components/categoryTag";
const { Search } = Input;

// type MenuItem = Required<MenuProps>["items"][number];
const ContainerHeight = 800;

const MenuBar = ({ menu, setMenu }) => {
  const {
    state: { currentId },
    dispatch,
  } = useReducerContext();
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState([]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  const TitleLabel = useMemo(() => {
    return (
      <div onClick={toggleCollapsed}>
        {collapsed ? <MenuFoldOutlined /> : "机器学习解释模型"}
      </div>
    );
  }, [collapsed, toggleCollapsed]);

  const items = [
    { key: MENU.title, label: TitleLabel, title: "展开菜单" },
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
      setMenu(MENU.local);
      dispatch({ type: "setCurrentId", payload: index });
      dispatch({ type: "setCompareItem", payload: undefined });
    },
    [dispatch]
  );
  const onSelect = useCallback(
    ({ item, key, keyPath, selectedKeys, domEvent }) => {
      setMenu(key);
    },
    []
  );

  const getIcon = useCallback((sample) => {
    const prcent = sample.percentage;
    const category = sample.category;

    let color = "#000";
    if (category[0] === "T") {
      color = "#2ca25f";
    } else color = "#e34a33";
    if (category[1] === "P") {
      return <CheckCircleFilled style={{ color: color }} className="icon" />;
    }
    return <CloseCircleFilled style={{ color: color }} className="icon" />;
  }, []);

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
        inlineCollapsed={collapsed}
        items={items}
        onSelect={onSelect}
      />
      <div
        className="sampleList"
        style={{ visibility: collapsed ? "hidden" : "visible" }}
      >
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
                    sample.id === currentId && menu === MENU.local
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

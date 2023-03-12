import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  PieChartOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  EditOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import { Button, MenuProps, Spin } from "antd";
import { Menu } from "antd";
import { useReducerContext } from "@/service/store";
import { MENU } from "@/constants";
import { api } from "@/service/request";

type MenuItem = Required<MenuProps>["items"][number];

const MenuBar = ({ menu, setMenu }) => {
  const {
    state: { totalSample, currentId },
    dispatch,
  } = useReducerContext();
  const [collapsed, setCollapsed] = useState(false);
  const [sampleVisible, setSampleVisible] = useState(true);
  const [samData, setSamData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const items: MenuItem[] = [
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
      onTitleClick: () => setSampleVisible((v) => !v),
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
    const prcent = sample[1];
    const category = sample[2];

    let color = "#000";
    if (category[0] === "T") {
      color = "#2ca25f";
    } else color = "#e34a33";
    if (category[1] === "P") {
      return <CheckCircleFilled style={{ color: color }} className="icon" />;
    }
    return <CloseCircleFilled style={{ color: color }} className="icon" />;
  }, []);

  // const samData = new Array(totalSample).fill(0);
  useEffect(() => {
    setLoading(true);
    api("getPredData").then((res) => {
      setSamData(res);
      setLoading(false);
    });
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
      <Spin spinning={loading}>
        {sampleVisible && (
          <div className="sampleList">
            {samData &&
              samData.map((sample, index) => (
                <Button
                  key={index}
                  className="sampleList-item"
                  type={
                    index === currentId && menu === MENU.local
                      ? "primary"
                      : "dashed"
                  }
                  onClick={() => onClick(index)}
                >
                  {index}
                  {getIcon(sample)}
                </Button>
              ))}
          </div>
        )}
      </Spin>
    </div>
  );
};

export default MenuBar;

import React, { useCallback, useMemo, useState } from "react";
import {
  PieChartOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import SampleList from "@/components/sample-list";
import { useReducerContext } from "@/service/store";

type MenuItem = Required<MenuProps>["items"][number];

const MenuBar: React.FC = () => {
 
  const [collapsed, setCollapsed] = useState(false);
  const [sampleVisible, setSampleVisible] = useState(false);

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
    { key: "0", label: TitleLabel, title: "展开菜单" },
    { key: "global", label: "Global Explanation", icon: <PieChartOutlined /> },
    {
      key: "local",
      label: "Local Explanation",
      children: [],
      icon: <BarChartOutlined />,
      onTitleClick: () => setSampleVisible((v) => !v),
    },
  ];

  return (
    <div style={{ maxWidth: 256 }}>
      <Menu
        defaultSelectedKeys={["global"]}
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
      />
      {sampleVisible && <SampleList />}
    </div>
  );
};

export default MenuBar;

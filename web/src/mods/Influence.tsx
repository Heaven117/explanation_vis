import React, { useState, useEffect } from "react";
import { api } from "@/service/request";
import { useReducerContext } from "@/service/store";
import InfluHeatmap from "@/components/influ-heatmap";
import { Drawer, Tabs, TabsProps } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const InfluencePart = ({ open, setOpen }) => {
  const {
    state: { currentId },
  } = useReducerContext();
  const [data, setData] = useState(null);

  useEffect(() => {
    api("getSimilarData", currentId).then((res) => {
      setData(res);
    });
  }, [currentId]);

  const colorBrewHarm = {
    colorStart: { red: 179, green: 0, blue: 0 },
    colorend: { red: 254, green: 240, blue: 217 },
  };
  const colorBrewHelp = {
    colorStart: { red: 186, green: 228, blue: 179 },
    colorend: { red: 0, green: 109, blue: 44 },
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Harmful`,
      children:
        data?.harmful.length > 0 ? (
          <InfluHeatmap h_data={data.harmful} colorBrew={colorBrewHarm} />
        ) : null,
    },
    {
      key: "2",
      label: `Helpful`,
      children:
        data?.helpful.length > 0 ? (
          <InfluHeatmap h_data={data.helpful} colorBrew={colorBrewHelp} />
        ) : null,
    },
  ];

  return (
    <Drawer
      className="InfluencePart"
      title={
        <Tabs
          tabBarExtraContent={<CloseOutlined onClick={() => setOpen(false)} />}
          defaultActiveKey="1"
          items={items}
        />
      }
      placement="right"
      onClose={() => setOpen(false)}
      open={open}
      closable={false}
      maskStyle={{ background: "transparent" }}
    ></Drawer>
  );
};

export default InfluencePart;

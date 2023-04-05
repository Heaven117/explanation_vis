import React, { useState, useEffect } from "react";
import { api } from "@/service/request";
import { useReducerContext } from "@/service/store";
import InfluHeatmap from "@/components/InfluHeatmap";
import { Drawer, Tabs, TabsProps } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const InfluenceDrawer = ({ open, setOpen }) => {
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
    colorend: { red: 253, green: 212, blue: 158 },
  };
  const colorBrewHelp = {
    colorStart: { red: 186, green: 228, blue: 179 },
    colorend: { red: 0, green: 109, blue: 44 },
  };

  const items = [
    {
      key: "1",
      label: `Helpful`,
      children:
        data?.helpful.length > 0 ? (
          <InfluHeatmap
            h_data={data.helpful.slice(0, 100)}
            colorBrew={colorBrewHelp}
          />
        ) : null,
    },
    {
      key: "2",
      label: `Harmful`,
      children:
        data?.harmful.length > 0 ? (
          <InfluHeatmap
            h_data={data.harmful.slice(0, 100)}
            colorBrew={colorBrewHarm}
          />
        ) : null,
    },
  ];

  return (
    <Drawer
      placement="bottom"
      className="InfluencePart"
      title="影响示例"
      onClose={() => setOpen(false)}
      open={open}
      maskStyle={{ background: "transparent" }}
      bodyStyle={{ paddingTop: 0 }}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Drawer>
  );
};

export default InfluenceDrawer;

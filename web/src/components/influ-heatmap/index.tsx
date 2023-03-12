import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./index.scss";
import { Tooltip } from "antd";

const InfluHeatmap = ({ h_data, colorBrew }) => {
  // console.log(h_data);
  const h_values = h_data.map((i) => i.value);

  // 颜色,根据数值均分
  function gerColorOfWeight(number) {
    const { colorStart, colorend } = colorBrew;
    const minNum = Math.min.apply(null, h_values);
    const maxNum = Math.max.apply(null, h_values);

    const colorR =
      ((colorend.red - colorStart.red) * (number - minNum)) /
        (maxNum - minNum) +
      colorStart.red;
    const colorG =
      ((colorend.green - colorStart.green) * (number - minNum)) /
        (maxNum - minNum) +
      colorStart.green;

    const colorB =
      ((colorend.blue - colorStart.blue) * (number - minNum)) /
        (maxNum - minNum) +
      colorStart.blue;

    const color = `rgb(${colorR},${colorG},${colorB})`;
    return color;
  }

  const Item = useCallback((item) => {
    const bgColor = gerColorOfWeight(item.value);
    return (
      <Tooltip title={item.value} color={bgColor} placement="left">
        <div
          className="heatCircle"
          style={{
            backgroundColor: bgColor,
          }}
        >
          {item.id}
        </div>
      </Tooltip>
    );
  }, []);
  return (
    <div id="container" className="h_container">
      {h_data.slice(0, 100).map((item) => Item(item))}
    </div>
  );
};

export default InfluHeatmap;

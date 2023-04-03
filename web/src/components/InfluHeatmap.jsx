import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Tooltip } from "antd";
import { useReducerContext } from "@/service/store";

const InfluHeatmap = ({ h_data, colorBrew }) => {
  const { dispatch } = useReducerContext();
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

  const onClick = (item) => {
    dispatch({ type: "setCompareItem", payload: item });
  };

  return (
    <>
      {h_data.map((item) => {
        return (
          <div
            className="drawerItem"
            key={item.id}
            style={{
              backgroundColor: gerColorOfWeight(item.value),
            }}
            onClick={() => onClick(item)}
          >
            <span>ID:&nbsp;{item.id}</span>
            <span>influence:&nbsp;{Number(item.value).toFixed(6)}</span>
          </div>
        );
      })}
    </>
  );
};

export default InfluHeatmap;

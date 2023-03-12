import React, { useState, useEffect, useMemo } from "react";
import * as echarts from "echarts";
import { useReducerContext } from "@/service/store";
import { api } from "@/service/request";
import { ft_names } from "@/constants";

const InstancePart = () => {
  var option;
  const {
    state: { currentId },
  } = useReducerContext();
  const [data, setData] = useState(null);
  console.log(ft_names);

  option = useMemo(
    () => ({
      tooltip:{},
      grid: {
        left: 250,
        top:10,
        right:10,
        bottom:100,
      },
      xAxis: {
        type: "value",
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "category",
        data: ft_names ,
        inverse: true,
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLine: {
          show: true,
        },
        z: 10,
        axisLabel: {
          interval: 0,
        },
      },
      series: [
        {
          type: "bar",
          showBackground: true,
          label: {
            position: "right",
            show: true,
          },
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#83bff6" },
              { offset: 0.5, color: "#188df0" },
              { offset: 1, color: "#188df0" },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#2378f7" },
                { offset: 0.7, color: "#2378f7" },
                { offset: 1, color: "#83bff6" },
              ]),
            },
          },
          data: data,
        },
      ],
    }),
    [data]
  );
  useEffect(() => {
    api("getInstance", currentId).then((res) => {
      setData(res.slice(1));
    });
  }, [currentId]);

  useEffect(() => {
    var chartDom = document.getElementById("InstancePart");
    var myChart = echarts.init(chartDom);
    myChart.setOption(option);
  }, [option]);
  return <div id="InstancePart"></div>;
};
export default InstancePart;

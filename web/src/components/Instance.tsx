import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as echarts from "echarts";
import { useReducerContext } from "@/service/store";
import { api } from "@/service/request";
import { ft_names } from "@/constants";
import { Spin } from "antd";
import _ from "lodash";

interface InstancePartProps {
  elementId: string;
  showId?: number;
  influenceValue?: number;
}
const InstancePart = (props: InstancePartProps) => {
  const { showId, elementId, influenceValue } = props;
  const {
    // state: { rawData },
    dispatch,
  } = useReducerContext();
  const [data, setData] = useState(null);
  const [anchor, setAnchor] = useState(null);
  const [id, setId] = useState(showId);
  const [loading, setLoading] = useState(false);

  const option = useMemo(
    () => ({
      tooltip: {},
      grid: {
        left: 250,
        top: 10,
        right: 30,
        bottom: 30,
      },
      xAxis: {
        type: "value",
        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "category",
        data: ft_names,
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
            color: function (params) {
              if (anchor?.includes(params.dataIndex)) {
                const colr = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#e34a33" },
                  { offset: 0.5, color: "#fc8d59" },
                  { offset: 1, color: "#fdcc8a" },
                ]);
                return colr;
              } else {
                const colr = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" },
                ]);
                return colr;
              }
            },
          },
          data: data,
        },
      ],
    }),
    [anchor, data]
  );

  const getData = useCallback(() => {
    // const sample = rawData?.[showId];
    // setData(sample?.slice(1));

    api("getInstance", showId).then((res) => {
      const { sample, id, anchor } = res;
      setData(sample?.slice(1));
      setAnchor(anchor);
      setId(id);
      setLoading(false);
    });
  }, [showId]);

  useEffect(() => {
    setLoading(true);
    getData();
  }, [getData]);

  useEffect(() => {
    var chartDom = document.getElementById(elementId);
    var myChart = echarts.init(chartDom);
    myChart && myChart.setOption(option);
  }, [option]);

  return (
    <Spin
      tip="Loading"
      spinning={loading}
      style={{ height: "100%" }}
      wrapperClassName="wrap"
    >
      <div>
        Id: {id}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        {!_.isNil(influenceValue) &&
          `Compared influence value: \t${influenceValue}`}
      </div>
      <div id={elementId} className="InstancePart"></div>
    </Spin>
  );
};
export default InstancePart;

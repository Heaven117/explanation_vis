import { useEffect } from "react";
import * as echarts from "echarts";
import { useReducerContext } from "../service/store";
import { adult_process_names, adult_target_value } from "../constants";
import { api } from "../service/request";

const ParallelCharts = ({ onCallback }) => {
  const {
    state: { currentId, modelInfo },
    dispatch,
  } = useReducerContext();
  let optionList = modelInfo?.categorical_names;
  const columnsName = adult_process_names.slice(0);
  columnsName.push("income");
  console.log(optionList);

  useEffect(() => {
    api("getHelpfulData", currentId).then((res) => {
      const { helpful, harmful } = res;
      console.log(helpful);

      var chartDom = document.getElementById("ParallelCharts");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        parallelAxis: columnsName.map((item, index) => {
          return index < 3
            ? {
                dim: index,
                name: item,
              }
            : {
                dim: index,
                name: item,
                type: "category",
                data:
                  item === "income" ? adult_target_value : optionList?.[item],
              };
        }),
        tooltip: {
          padding: 10,
          borderColor: "#777",
          borderWidth: 1,
          formatter: (item) => {
            return `id: ${item.data.rawData.data.id} <br/>influence:${item.data.rawData.value}`;
          },
        },
        legend: {
          bottom: 30,
          data: [
            {
              name: "helpful",
              itemStyle: { color: "#ff8c00", borderColor: "#ff8c00" },
            },
            {
              name: "harmful",
              itemStyle: { color: "#98abc5", borderColor: "#98abc5" },
            },
          ],
          itemGap: 20,
          textStyle: {
            fontSize: 14,
          },
        },
        series: [
          {
            name: "helpful",
            type: "parallel",
            data: helpful.map((item, index) => {
              return {
                value: columnsName.map((c) => {
                  return c === "income"
                    ? adult_target_value[item.data?.[c]]
                    : item.data[c];
                }),
                lineStyle: {
                  color:
                    index === helpful.length - 1
                      ? "red"
                      : echarts.color.modifyAlpha("#ff8c00", item.value),
                  width: index === harmful.length - 1 ? 4 : item.value * 10,
                },
                rawData: item,
              };
            }),
          },
          {
            name: "harmful",
            type: "parallel",
            data: harmful.map((item, index) => {
              return {
                value: columnsName.map((c) => {
                  return c === "income"
                    ? adult_target_value[item.data?.[c]]
                    : item.data[c];
                }),
                lineStyle: {
                  color:
                    index === harmful.length - 1
                      ? "red"
                      : echarts.color.modifyAlpha(
                          "#98abc5",
                          Math.abs(item.value)
                        ),
                  width:
                    index === harmful.length - 1
                      ? 4
                      : Math.abs(item.value) * 10,
                },
                rawData: item,
              };
            }),
          },
        ],
      };

      option && myChart.setOption(option);
      myChart.on("click", function (params) {
        onCallback(params.data.rawData);
      });
    });
  }, [currentId, optionList]);

  return <div id="ParallelCharts" style={{ width: "100%", height: 500 }}></div>;
};

export default ParallelCharts;

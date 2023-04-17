import { useState, useRef } from "react";
import { Button, Form, Select, Input } from "antd";
import { adult_process_names as columnsName } from "../constants";
import _ from "lodash";
import { api } from "@/service/request";
import { useEffect } from "react";
import { predictionTag } from "../components/tags";
import { useMemo } from "react";
import { useReducerContext } from "../service/store";
import { Pie, Line } from "@antv/g2plot";

const LineChat = ({ data }) => {
  const percentBar = useRef();

  useEffect(() => {
    const line = new Line(percentBar.current, {
      data,
      height: 100,
      padding: "auto",
      xField: "index",
      yField: "value",
      // xAxis: {
      //   tickCount: 3,
      // },
      yAxis: {
        maxLimit: 0.5,
        tickCount: 3,
      },
    });
    line.render();
  });

  return (
    <div id="container" ref={percentBar} style={{ display: "inline-block" }} />
  );
};

function GlobalPage({ initVal }) {
  const {
    state: { modelInfo },
    dispatch,
  } = useReducerContext();
  const optionList = modelInfo?.categorical_names;
  const [result, setResult] = useState();
  const [importance, setImportance] = useState();
  const pie = useRef();

  const drawPie = (data) => {
    const piePlot = new Pie(pie.current, {
      appendPadding: 10,
      data,
      angleField: "value",
      colorField: "type",
      radius: 0.9,
      label: {
        type: "inner",
        offset: "-30%",
        content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
        style: {
          fontSize: 14,
          textAlign: "center",
        },
      },
      interactions: [{ type: "element-active" }],
    });

    piePlot.render();
  };

  useEffect(() => {
    api("getGlobalData").then((res) => {
      const { feature_importance, pd_values } = res;
      const pd_list = [];
      pd_values.forEach((item, idx) => {
        let tmp = item[0];
        tmp = tmp.map((t, index) => ({
          value: t,
          index: optionList[columnsName[idx]]?.[index] ?? index,
        }));
        pd_list.push(tmp);
      });
      setResult(pd_list);
      const fi = feature_importance[0].map((item, index) => ({
        value: item,
        type: columnsName[index],
      }));
      setImportance(fi);
      drawPie(fi);
    });
  }, []);

  return (
    <>
      <div className="globalPage">
        <div>
          <h2>Partial Dependence Variance</h2>
          <div ref={pie} style={{ width: 1000 }} />
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              columnGap: 50,
              rowGap: 30,
            }}
          >
            {result?.map((item, index) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "40%",
                  justifyContent: "center",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  im(<strong>{columnsName[index]}</strong>) =
                  {Number(importance[index].value).toFixed(3)}
                </div>
                <LineChat data={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default GlobalPage;

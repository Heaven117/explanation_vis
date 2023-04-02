import React, { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";
import InstanceTable from "../components/InstanceTable";
import { useReducerContext } from "@/service/store";
import { Button, Progress } from "antd";
import InfluenceDrawer from "../components/InfluenceDrawer";
import { api } from "@/service/request";
import { draw_percent_bar } from "@/components/percentage_bar";
import { categoryTag } from "@/components/categoryTag";

function LocalPage() {
  const {
    state: { currentId, compareItem },
    // dispatch,
  } = useReducerContext();
  const [openInfluencePart, setOpenInfluencePart] = useState(false);
  const [data, setData] = useState([]);
  const [curInstance, setCurInstance] = useState();
  const percentBar = useRef();

  const showDrawer = () => {
    setOpenInfluencePart(true);
  };

  const getData = useCallback((showId) => {
    api("getInstance", showId).then((res) => {
      const { sample, id, predict } = res;
      sample.category = predict.category;
      sample.percentage = predict.percentage;
      console.log("sample", sample);

      setCurInstance(sample);
      setData([sample]);
    });
  }, []);

  useEffect(() => {
    getData(currentId);
  }, [getData, currentId]);

  useEffect(() => {
    curInstance &&
      draw_percent_bar(percentBar.current, curInstance?.percentage);
  }, [curInstance]);

  return (
    <div className="localPage">
      <div className="main">
        <div className="top">
          <span style={{ marginRight: 50 }}>ID: {curInstance?.id}</span>
          <svg ref={percentBar} className="percentBar" />
          <Button type="primary" onClick={showDrawer} className="showDrawerBtn">
            Open
          </Button>
        </div>
        {!_.isNil(currentId) && data && (
          <InstanceTable showId={currentId} tableData={data} />
        )}
      </div>

      {/* 影响示例抽屉 */}
      {openInfluencePart && (
        <InfluenceDrawer
          open={openInfluencePart}
          setOpen={setOpenInfluencePart}
        />
      )}
    </div>
  );
}

export default LocalPage;

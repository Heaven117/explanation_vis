import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import _ from "lodash";
import SampleDesc from "../components/SampleDesc";
import { useReducerContext } from "@/service/store";
import { Descriptions, Tabs, Slider } from "antd";
import { adult_target_value as targetName, TabItems } from "../constants";

import { predictionTag, categoryTag } from "../components/tags";
import { draw_percent_bar } from "../components/percentage_bar";
import { api } from "../service/request";
import * as d3 from "d3";
import AnchorExp from "./AnchorExp";
import InfExp from "./InfExp";
import CfsExp from "./CfsExp";
import InfoCard from "../components/InfoCard";

function LocalPage() {
  const {
    state: { currentId, curSample },
    dispatch,
  } = useReducerContext();
  const percentBar = useRef();
  const [sampleData, setSampleData] = useState([]);
  const [featureName, setFeatureName] = useState();

  // api获取示例
  useEffect(() => {
    api("getInstance", currentId).then((res) => {
      const { sample } = res;
      setSampleData([sample]);
      draw_percent_bar(percentBar.current, sample?.percentage);
      dispatch({
        type: "setCurSample",
        payload: { sample: sample },
      });
    });
  }, [currentId, dispatch]);

  return (
    <div className="localPage">
      <div className="sample">
        <div className="top">
          <h2>Sample Info</h2>
          <InfoCard data={curSample} percentBar={percentBar} />
          <div>
            <svg ref={percentBar} className="percentBar" />
          </div>
          {/* <div className="top-info">
            <div className="label">ID: </div>
            {curSample?.id}
          </div>
          <div className="top-info">
            <div className="label">Category: </div>
            {categoryTag(curSample?.category)}
          </div>
          <div className="top-info">
            <div className="label">Label: </div>
            {predictionTag(curSample?.income)}
          </div>
          <div className="top-info">
            <div className="label">Prediction: </div>
            {predictionTag(curSample?.prediction)}
          </div>
          <div className="top-info">
            <svg ref={percentBar} className="percentBar" />
          </div> */}
        </div>
        <SampleDesc featureName={featureName} descData={sampleData} />
      </div>

      <AnchorExp featureName={featureName} setFeatureName={setFeatureName} />
      <InfExp />
      <CfsExp />
    </div>
  );
}

export default LocalPage;

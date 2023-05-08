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
import { draw_percent_bar } from "../components/percentage_bar";
import { api } from "../service/request";
import AnchorExp from "./AnchorExp";
import InfExp from "./InfExp";
import CfsExp from "./CfsExp";
import InfoCard from "../components/InfoCard";
import EditPage from "./EditPage";

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
        </div>
        <SampleDesc featureName={featureName} descData={sampleData} />
        <EditPage />
      </div>

      <AnchorExp featureName={featureName} setFeatureName={setFeatureName} />
      <InfExp />
      <CfsExp />
    </div>
  );
}

export default LocalPage;

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
import { predictionTag, categoryTag } from "../components/tags";
import { adult_target_value } from "../constants";
import { Radio, Switch } from "antd";

function LocalPage() {
  const {
    state: { currentId, curSample, isAb },
    dispatch,
  } = useReducerContext();
  const percentBar = useRef();
  const [sampleData, setSampleData] = useState([]);
  const [featureName, setFeatureName] = useState();
  const onChange = (value) => {
    dispatch({
      type: "setIsAb",
      payload: value,
    });
  };

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
          <div>
            <span className="label">是否开启用户调研模式：</span>
            <Switch checked={isAb} onChange={onChange} />
          </div>
          <h2>Sample Info</h2>
          <InfoCard data={curSample} isAB={isAb} />
          <div className="label">Probability of {adult_target_value[1]}: </div>
          <div>
            <svg ref={percentBar} className="percentBar" />
          </div>

          {isAb && (
            <>
              <div className="label">User Decision : </div>
              <Radio.Group
                options={adult_target_value}
                optionType="button"
                buttonStyle="solid"
              />
            </>
          )}
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

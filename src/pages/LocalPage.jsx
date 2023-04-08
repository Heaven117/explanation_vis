import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import _ from "lodash";
import SampleDesc from "@/components/SampleDesc";
import { useReducerContext } from "@/service/store";
import { Button, Tabs } from "antd";
import { adult_target_value as targetName, TabItems } from "@/constants";

import InfluenceDrawer from "../components/InfluenceDrawer";
import { predictionTag } from "@/components/tags";
import { draw_percent_bar } from "@/components/percentage_bar";
import { drawRadialStackedBarChart } from "@/components/radialBarChart";
import { api } from "@/service/request";

function LocalPage() {
  const {
    state: { currentId, curSample, curAnchor },
    dispatch,
  } = useReducerContext();
  const percentBar = useRef();
  const RadialArea = useRef();
  const [tab, setTab] = useState(3);
  const [featureIdx, setFeatureIdx] = useState(0);
  const [featureName, setFeatureName] = useState();
  const [sampleData, setSampleData] = useState([]);
  const [cfsList, setCfsList] = useState([]);
  const [inDrawerVisible, setInDrawerVisible] = useState(false);

  useEffect(() => {
    api("getInstance", currentId).then((res) => {
      const { sample } = res;
      dispatch({
        type: "setCurSample",
        payload: { sample: sample },
      });
    });
    api("getAnchor", currentId).then((res) => {
      dispatch({
        type: "setCurAnchor",
        payload: { anchor: res },
      });
    });
    api("getDiceData", currentId).then((res) => {
      setCfsList(res.cfs_list);
    });
  }, [currentId, dispatch]);

  useEffect(() => {
    setSampleData([curSample]);
    curSample && draw_percent_bar(percentBar.current, curSample?.percentage);
  }, [curSample]);

  useEffect(() => {
    setFeatureIdx(0);
    setFeatureName(curAnchor?.feature[0]);
  }, [curAnchor?.feature]);

  const onButtonClick = useCallback(
    (index) => {
      setFeatureIdx(index);
      setFeatureName(curAnchor?.feature.slice(0, index + 1));
    },
    [curAnchor?.feature]
  );

  const drawRadialChart = () => {
    drawRadialStackedBarChart(RadialArea);
  };

  const onTabChange = (key) => {
    setTab(key);
    if (key === 4) drawRadialChart();
    console.log(key);
  };

  return (
    <div className="localPage">
      <div className="top">
        <span style={{ marginRight: 50 }}>ID: {curSample?.id}</span>
        <svg ref={percentBar} className="percentBar" />
        {/* <div className="topBtn">
          <Button type="primary" onClick={() => setInDrawerVisible(true)}>
            Open Influence
          </Button>
          <Button type="primary">Open Dice</Button>
        </div> */}
      </div>
      <div className="action">
        If all of these are true:
        <span className="buttonGroup">
          {curAnchor?.feature.map((item, index) => (
            <Button
              key={index}
              className="btn"
              value={index}
              onClick={() => onButtonClick(index)}
              type={index <= featureIdx ? "primary" : "default"}
            >
              {item}
            </Button>
          ))}
        </span>
        <br />
        <br />
        The model will predict&nbsp;
        {predictionTag(curSample?.prediction)}
        <span style={{ fontSize: 20, fontWeight: 500 }}>
          {Number(curAnchor?.precision[featureIdx] * 100).toFixed(2)}&nbsp;%
        </span>
        &nbsp;of the time And samples coverage is :&nbsp;
        <span style={{ fontSize: 20, fontWeight: 500 }}>
          {curAnchor?.coverage[featureIdx] === -1
            ? "None"
            : Number(curAnchor?.coverage[featureIdx] * 100).toFixed(2)}
          &nbsp; %
        </span>
        <br />
      </div>
      <Tabs defaultActiveKey={tab} items={TabItems} onChange={onTabChange} />
      <div style={{ display: "flex", columnGap: 50 }}>
        <SampleDesc featureName={featureName} descData={sampleData} />
        {/* <LocalTable
        tableLoading={tableLoading}
        sampleData={sampleData}
        featureName={featureName}
      /> */}
        {tab === 1 && (
          <SampleDesc
            featureName={featureName}
            descData={curAnchor?.covered_true[featureIdx]}
          />
        )}
        {tab === 2 && (
          <SampleDesc
            featureName={featureName}
            descData={curAnchor?.covered_false[featureIdx]}
          />
        )}
        {tab === 3 && <SampleDesc isDice={true} descData={cfsList} />}
        {tab === 4 && <svg ref={RadialArea} className="RadialArea" />}
      </div>
      {/* 影响示例抽屉 */}
      {inDrawerVisible && (
        <InfluenceDrawer open={inDrawerVisible} setOpen={setInDrawerVisible} />
      )}
    </div>
  );
}

export default LocalPage;

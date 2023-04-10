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
import { Button, Tabs, Slider } from "antd";
import { adult_target_value as targetName, TabItems } from "../constants";

import InfluenceDrawer from "../components/InfluenceDrawer";
import { predictionTag } from "../components/tags";
import { draw_percent_bar } from "../components/percentage_bar";
import { radialBarChart } from "../components/radialBarChart";
import { api } from "../service/request";
import * as d3 from "d3";

function LocalPage() {
  const {
    state: { currentId, curSample, curAnchor },
    dispatch,
  } = useReducerContext();
  const percentBar = useRef();
  const RadialArea = useRef();
  const [tab, setTab] = useState(1);
  const [featureIdx, setFeatureIdx] = useState(0);
  const [featureName, setFeatureName] = useState();
  const [sampleData, setSampleData] = useState([]);
  const [infData, setInfData] = useState();
  const [infSelect, setInfSelect] = useState();
  const [cfsList, setCfsList] = useState([]);
  const [inDrawerVisible, setInDrawerVisible] = useState(false);
  const [sliderVal, setSliderVal] = useState([-0.2, 0.2]);

  // api获取示例、anchor、dice
  useEffect(() => {
    api("getInstance", currentId).then((res) => {
      const { sample } = res;
      setSampleData([sample]);
      // draw_percent_bar(percentBar.current, sample?.percentage);
      dispatch({
        type: "setCurSample",
        payload: { sample: sample },
      });
    });
    api("getAnchor", currentId).then((res) => {
      setFeatureIdx(0);
      setFeatureName(res?.feature[0]);
      dispatch({
        type: "setCurAnchor",
        payload: { anchor: res },
      });
    });
  }, [currentId, dispatch]);

  const onButtonClick = useCallback(
    (index) => {
      setFeatureIdx(index);
      setFeatureName(curAnchor?.feature.slice(0, index + 1));
    },
    [curAnchor?.feature]
  );
  const onRadialCallback = useCallback(
    (data) => {
      const { id, value } = data;
      dispatch({ type: "setCompareItem", payload: id });
      api("getInstance", id).then((res) => {
        const { sample } = res;
        setInfSelect({ data: [sample], value: value });
      });
    },
    [dispatch]
  );

  useEffect(() => {
    if (tab !== 4 || !infData) return;
    const config = {
      width: 400,
      height: 400,
      innerRadius: 0,
      outerRadius: 150,
    };
    const tmp = [...infData.helpful, ...infData.harmful];
    const data = tmp?.filter(
      (item) => item.value >= sliderVal[0] && item.value <= sliderVal[1]
    );
    console.log(data);
    radialBarChart(RadialArea.current, config, data, onRadialCallback);
  }, [infData, onRadialCallback, sliderVal, tab]);

  const onTabChange = (key) => {
    setTab(key);
    switch (key) {
      case 3:
        api("getDiceData", currentId).then((res) => {
          setCfsList(res.cfs_list);
        });
        break;
      case 4:
        api("getInfluenceData", currentId).then((res) => {
          setInfData(res);
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="localPage">
      {/* <div className="top">
        <span style={{ marginRight: 50 }}>ID: {curSample?.id}</span>
        <svg ref={percentBar} className="percentBar" />
      </div> */}
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
        {tab === 4 && (
          <>
            <SampleDesc
              featureName={featureName}
              descData={infSelect?.data}
              infValue={infSelect?.value}
            />
            <div>
              <Slider
                style={{ width: 100 }}
                range
                onChange={setSliderVal}
                value={sliderVal}
                // defaultValue={[-0.1, 0.1]}
                max={infData?.max}
                min={infData?.min}
                step={(infData?.max - infData?.min) / 100}
              />
              <svg
                ref={RadialArea}
                className="RadialArea"
                style={{ position: "relative" }}
              />
            </div>
          </>
        )}
      </div>
      {/* 影响示例抽屉 */}
      {inDrawerVisible && (
        <InfluenceDrawer open={inDrawerVisible} setOpen={setInDrawerVisible} />
      )}
    </div>
  );
}

export default LocalPage;

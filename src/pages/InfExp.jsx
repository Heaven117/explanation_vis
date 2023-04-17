import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Progress, Slider } from "antd";
import { useReducerContext } from "../service/store";
import { predictionTag } from "../components/tags";
import { api } from "../service/request";
import SampleDesc from "../components/SampleDesc";
import { radialBarChart } from "../components/radialBarChart";
import InfoCard from "../components/InfoCard";
import { draw_percent_bar } from "../components/inf_bar";

function InfExp(props) {
  const {
    state: { currentId, curSample, curAnchor },
    dispatch,
  } = useReducerContext();
  const RadialArea = useRef();
  const percentBar = useRef();
  const [infData, setInfData] = useState();
  const [infSelect, setInfSelect] = useState();
  const [sliderVal, setSliderVal] = useState([-0.2, 0.2]);

  const onRadialCallback = useCallback(
    (data) => {
      const { id, value } = data;
      console.log(id, value);
      dispatch({ type: "setCompareItem", payload: id });
      api("getInstance", id).then((res) => {
        const { sample } = res;
        setInfSelect({ data: [sample], value: value });
        draw_percent_bar(percentBar.current, value);
      });
    },
    [dispatch]
  );

  useEffect(() => {
    if (!infData) return;
    const config = {
      width: 400,
      height: 400,
      innerRadius: 0,
      outerRadius: 150,
    };
    const tmp = [...infData?.helpful, ...infData?.harmful];
    const data = tmp?.filter(
      (item) => item.value >= sliderVal[0] && item.value <= sliderVal[1]
    );
    // console.log(data);
    radialBarChart(RadialArea.current, config, data, onRadialCallback);
  }, [infData, onRadialCallback, sliderVal]);

  useEffect(() => {
    api("getInfluenceData", currentId).then((res) => {
      setInfData(res);
    });
  }, [currentId]);

  return (
    <div style={{ marginTop: 50 }}>
      <h2>Case-based Explanations</h2>
      <div style={{ display: "flex", columnGap: 50 }}>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Slider
              style={{ width: 100 }}
              range
              onChange={setSliderVal}
              value={sliderVal}
              max={infData?.max}
              min={infData?.min}
              step={(infData?.max - infData?.min) / 100}
            />
            <Progress
              style={{ width: 100 }}
              showInfo={false}
              percent={infData?.harmPer * 100}
              size="small"
              trailColor="#ff8c00"
              strokeColor="#98abc5"
            />
          </div>

          <svg
            ref={RadialArea}
            className="RadialArea"
            style={{ position: "relative" }}
          />
        </div>
        <SampleDesc descData={infSelect?.data} />
        <div>
          {infSelect && <InfoCard data={infSelect.data[0]} />}
          <div>
            <svg ref={percentBar} className="percentBar" />
          </div>
        </div>
      </div>
    </div>
  );
}
export default InfExp;

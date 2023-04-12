import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Collapse, Slider } from "antd";
import { useReducerContext } from "../service/store";
import { predictionTag } from "../components/tags";
import { api } from "../service/request";
import SampleDesc from "../components/SampleDesc";

function AnchorExp(props) {
  const { featureName, setFeatureName } = props;
  const {
    state: { currentId, curSample, curAnchor },
    dispatch,
  } = useReducerContext();
  const [featureIdx, setFeatureIdx] = useState(0);
  //   const [featureName, setFeatureName] = useState();

  const onButtonClick = useCallback(
    (index) => {
      setFeatureIdx(index);
      setFeatureName(curAnchor?.feature.slice(0, index + 1));
    },
    [curAnchor?.feature, dispatch]
  );

  useEffect(() => {
    api("getAnchor", currentId).then((res) => {
      setFeatureIdx(0);
      setFeatureName(res?.feature[0]);
      dispatch({
        type: "setCurAnchor",
        payload: { anchor: res },
      });
    });
  }, [currentId, dispatch, setFeatureName]);

  return (
    <div style={{ marginTop: 50 }}>
      <h2>Rule-based Explanations</h2>
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

      <div style={{ display: "flex", columnGap: 50 }}>
        <Collapse ghost>
          <Collapse.Panel
            header="Examples of consistent predictions"
            style={{
              width: 500,
              backgroundColor: "rgba(0, 0, 0, 0.02)",
              border: "1px solid #d9d9d9",
              borderRadius: 8,
            }}
          >
            <SampleDesc
              featureName={featureName}
              descData={curAnchor?.covered_true[featureIdx]}
            />
          </Collapse.Panel>
        </Collapse>
        <Collapse ghost>
          <Collapse.Panel
            header="Examples of inconsistent predictions"
            style={{
              width: 500,
              backgroundColor: "rgba(0, 0, 0, 0.02)",
              border: "1px solid #d9d9d9",
              borderRadius: 8,
            }}
          >
            <SampleDesc
              featureName={featureName}
              descData={curAnchor?.covered_false[featureIdx]}
            />
          </Collapse.Panel>
        </Collapse>
      </div>
    </div>
  );
}
export default AnchorExp;

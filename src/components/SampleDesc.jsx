import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useReducerContext } from "@/service/store";
import _ from "lodash";

import { Empty, Descriptions, Pagination } from "antd";
import { adult_process_names as columnsName } from "@/constants";
import { predictionTag, categoryTag } from "../components/tags";

const SampleDesc = (props) => {
  const { descData, featureName = null, isDice = false } = props;
  const {
    state: { curSample },
  } = useReducerContext();
  const [current, setCurrent] = useState(1);
  const [data, setData] = useState();
  // console.log(data);

  useEffect(() => {
    setData(descData?.[0]);
  }, [descData]);

  const onChange = (page) => {
    // console.log(page);
    setCurrent(page);
    setData(descData?.[page - 1]);
  };

  return descData ? (
    <div>
      <Descriptions
        bordered
        column={1}
        size="small"
        style={{ width: 350 }}
        labelStyle={{ width: 150 }}
      >
        {columnsName.map((column, index) => (
          <Descriptions.Item
            label={column}
            className={featureName?.includes(column) ? "hightLightCol" : ""}
          >
            {isDice && data?.[column] === curSample?.[column]
              ? "-"
              : data?.[column]}
          </Descriptions.Item>
        ))}
      </Descriptions>
      <Pagination
        hideOnSinglePage
        current={current}
        onChange={onChange}
        defaultPageSize={1}
        total={descData?.length}
        size="small"
        showSizeChanger={false}
        style={{ marginTop: 20 }}
      />
    </div>
  ) : (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  );
};
export default SampleDesc;

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useReducerContext } from "@/service/store";

import { Button, Descriptions, Pagination } from "antd";
import { adult_process_names as columnsName } from "@/constants";
import { predictionTag, categoryTag } from "@/components/tags";

const SampleDesc = ({ descData, featureName, isDice = false }) => {
  const {
    state: { curSample },
  } = useReducerContext();
  const [current, setCurrent] = useState(1);
  const [data, setData] = useState();
  console.log(data);

  useEffect(() => {
    setData(descData?.[0]);
  }, [descData]);

  const onChange = (page) => {
    // console.log(page);
    setCurrent(page);
    setData(descData[page - 1]);
  };

  const Title = useMemo(() => {
    return isDice ? (
      <>反转示例</>
    ) : (
      <div>
        <span style={{ marginRight: 10 }}>ID: {data?.id}</span>
        <span>{categoryTag(data?.category)}</span>
        <span>{predictionTag(data?.prediction)}</span>
      </div>
    );
  }, [data, isDice]);

  return descData ? (
    <div>
      <Descriptions
        bordered
        column={1}
        size="small"
        style={{ width: 350 }}
        labelStyle={{ width: 150 }}
        title={Title}
        // extra={ <Button type="primary">Edit</Button>}
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
        total={descData.length}
        size="small"
        showSizeChanger={false}
        style={{ marginTop: 20 }}
      />
    </div>
  ) : (
    "!!! No anchors found !!!"
  );
};
export default SampleDesc;

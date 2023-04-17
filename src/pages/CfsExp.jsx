import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Table, Button, Slider } from "antd";
import { useReducerContext } from "../service/store";
import { api } from "../service/request";
import { adult_process_names as columnsName } from "../constants";
import { predictionTag, categoryTag } from "../components/tags";

window.ResizeObserver = undefined;

function CfsExp(props) {
  const {
    state: { currentId },
    dispatch,
  } = useReducerContext();
  const [cfsList, setCfsList] = useState();

  const getColumns = useMemo(() => {
    const columns = columnsName.map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      with: 200,
      render: (cur, record, index) => {
        return index !== 0 && cur === cfsList?.[0]?.[item] ? "-" : cur;
      },
    }));
    columns.push(
      ...[
        {
          title: "prediction",
          dataIndex: "prediction",
          key: "prediction",
          fixed: "right",
          render: (cur, record, index) => {
            return predictionTag(cur);
          },
        },
      ]
    );
    return columns;
  }, [cfsList]);

  useEffect(() => {
    api("getDiceData", currentId).then((res) => {
      // setCfsList(res.cfs_list);
      setCfsList(res);
    });
  }, [currentId]);

  return (
    <div style={{ marginTop: 50 }}>
      <h2>Counterfactual Explanations</h2>
      <div>
        {/* <SampleDesc isDice={true} descData={cfsList} /> */}
        <Table
          className="sampleTable"
          scroll={{ x: 1600 }}
          columns={getColumns}
          rowKey="id"
          dataSource={cfsList}
          pagination={false}
        />
      </div>
    </div>
  );
}

export default CfsExp;

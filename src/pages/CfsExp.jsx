import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Table, Collapse, Slider } from "antd";
import { useReducerContext } from "../service/store";
import { predictionTag } from "../components/tags";
import { api } from "../service/request";
import SampleDesc from "../components/SampleDesc";
import { adult_process_names as columnsName } from "../constants";

function CfsExp(props) {
  const {
    state: { currentId },
    dispatch,
  } = useReducerContext();
  const [cfsList, setCfsList] = useState([]);

  const getColumns = useMemo(() => {
    const columns = columnsName.map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
    }));
    return columns;
  }, []);

  useEffect(() => {
    api("getDiceData", currentId).then((res) => {
      setCfsList(res.cfs_list);
    });
  }, []);

  return (
    <div style={{ marginTop: 50 }}>
      <h2>Counterfactual Explanations</h2>
      <div>
        <SampleDesc isDice={true} descData={cfsList} />
        <Table
          className="sampleTable"
          scroll={{ x: 1800, y: 500 }}
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

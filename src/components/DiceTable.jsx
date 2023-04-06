import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useReducerContext } from "@/service/store";
import {
  adult_process_names as columnsName,
  adult_target_value as targetName,
} from "@/constants";
import { Button, Table } from "antd";
import { cloneDeep } from "lodash";
import { categoryTag, predictionTag } from "@/components/tags";

const DiceTable = (props) => {
  const { tableData, loading } = props;
  const {
    state: { currentId, curSample, curAnchor, compareItem },
    dispatch,
  } = useReducerContext();
  const [data, setData] = useState([{ id: "0" }]);

  const sharedOnCell = (dataType, index) => {
    if (dataType?.description) {
      return { colSpan: 0 };
    }
    return {};
  };

  const getColumns = useMemo(() => {
    const columns = [
      {
        title: "index",
        dataIndex: 0,
        key: 0,
        fixed: "left",
        width: 120,
        render: (_, record, index) => index,
      },
    ];
    const _columns = columnsName.map((item, index) => ({
      title: item,
      dataIndex: item,
      key: item,
      render: (_, record) => {
        const re = cloneDeep(record[index]);
        const cur = cloneDeep(curSample[item]);
        // console.log(text, text2, text === text2);
        return re === cur ? "-" : re;
      },
    }));
    columns.push(..._columns);
    columns.push(
      ...[
        {
          title: "prediction",
          key: "prediction",
          fixed: "right",
          width: 110,
          onCell: sharedOnCell,
          render: (_, record) => predictionTag(targetName[record[11]]),
        },
        {
          title: "Action",
          key: "operation",
          fixed: "right",
          width: 100,
          onCell: sharedOnCell,
          render: () => <a>action</a>,
        },
      ]
    );
    console.log(columns);
    return columns;
  }, []);

  useEffect(() => {
    console.log(tableData);
    setData(tableData);
  }, [tableData]);

  return (
    <Table
      className="diceTable"
      loading={loading}
      scroll={{ x: 1800 }}
      columns={getColumns}
      // rowKey={0}
      dataSource={data}
      pagination={false}
    />
  );
};
export default DiceTable;

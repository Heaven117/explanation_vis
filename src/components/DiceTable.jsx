import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useReducerContext } from "@/service/store";
import { adult_process_names as columnsName } from "@/constants";
import { Button, Table } from "antd";
import _ from "lodash";
import { categoryTag, predictionTag } from "@/components/tags";

const DiceTable = (props) => {
  const { tableData, featureName, loading } = props;
  const [data, setData] = useState([{ id: "0" }]);

  const sharedOnCell = (dataType, index) => {
    if (dataType?.description) {
      return { colSpan: 0 };
    }
    return {};
  };

  const getColumns = useMemo(() => {
    const columns = [
    //   {
    //     title: "index",
    //     dataIndex: 0,
    //     key: 0,
    //     fixed: "left",
    //     width: 120,
    //     onCell: (dataType, index) => ({
    //       colSpan: dataType?.description ? 9 : 1,
    //     }),
    //   },
    ].concat();
    const _columns = columnsName.map((item, index) => ({
      title: item,
      dataIndex: index + 1,
      key: index + 1,
    }));
    columns.concat(_columns);
    columns.push(
      ...[
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
    return columns;
  }, [featureName]);

  useEffect(() => {
    // console.log(tableData);
    setData(tableData);
  }, [tableData]);

  return (
    <Table
      className="diceTable"
      loading={loading}
      scroll={{ x: 1800 }}
      columns={getColumns}
      rowKey={0}
      dataSource={data}
      pagination={false}
    />
  );
};
export default DiceTable;

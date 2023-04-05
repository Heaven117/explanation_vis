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

const LocalTable = (props) => {
  const { tableData, featureName, loading } = props;
  const [data, setData] = useState([{ id: "0" }]);

  const sharedOnCell = (dataType, index) => {
    if (dataType?.description) {
      return { colSpan: 0 };
    }
    return {};
  };

  const getColumns = useMemo(() => {
    const columns = columnsName.map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      className: featureName?.includes(item) ? "hightLightCol" : "",
      onCell: sharedOnCell,
    }));
    columns.unshift(
      ...[
        {
          title: "id",
          dataIndex: "id",
          key: "id",
          fixed: "left",
          width: 120,
          onCell: (dataType, index) => ({
            colSpan: dataType?.description ? 9 : 1,
          }),
        },
      ]
    );
    columns.push(
      ...[
        {
          title: "category",
          key: "category",
          dataIndex: "category",
          onCell: sharedOnCell,
          render: (_, record) => categoryTag(record?.category),
        },
        {
          title: "prediction",
          key: "prediction",
          fixed: "right",
          width: 110,
          onCell: sharedOnCell,
          render: (_, record) => predictionTag(record?.prediction),
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
    return columns;
  }, [featureName]);

  useEffect(() => {
    // console.log(tableData);
    setData(tableData);
  }, [tableData]);

  return (
    <Table
      sticky
      className="sampleTable"
      loading={loading}
      scroll={{ x: 1800 }}
      columns={getColumns}
      rowKey="id"
      dataSource={data}
      pagination={false}
    />
  );
};
export default LocalTable;

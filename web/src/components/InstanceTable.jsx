import React, { useState, useEffect, useMemo, useCallback } from "react";
import * as echarts from "echarts";
import { useReducerContext } from "@/service/store";
import { api } from "@/service/request";
import { adult_process_names as columnsName } from "@/constants";
import { Form, Popconfirm, Spin, Table, Tag, Typography } from "antd";
import _ from "lodash";
import { categoryTag } from "./categoryTag";

const InstanceTable = (props) => {
  const { showId, tableData } = props;
  console.log(tableData);

  const [data, setData] = useState(tableData);

  const getColumns = useMemo(() => {
    const columns = columnsName.map((item) => ({
      title: item,
      dataIndex: item,
      key: item,
      width: 150,
    }));
    columns.unshift(
      ...[
        { title: "id", dataIndex: "id", key: "id", width: 100 },
        {
          title: "category",
          key: "category",
          dataIndex: "category",
          width: 100,
          render: (_, { category }) => categoryTag(category),
        },
      ]
    );

    return columns;
  }, []);

  return <Table columns={getColumns} rowKey="id" dataSource={data} />;
};
export default InstanceTable;

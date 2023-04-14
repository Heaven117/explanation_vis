import { useState } from "react";
import { Button, Form, Select, Input } from "antd";
import { adult_process_names as columnsName } from "../constants";
import _ from "lodash";
import { api } from "@/service/request";
import { useEffect } from "react";
import { predictionTag } from "../components/tags";
import { useMemo } from "react";
import { useReducerContext } from "../service/store";

function EditPage({ initVal }) {
  const {
    state: { modelInfo },
    dispatch,
  } = useReducerContext();
  const optionList = modelInfo.categorical_names;
  const [result, setResult] = useState();

  const onFinish = (values) => {
    console.log(values);
    api("runModel", values, "POST").then((res) => {
      setResult(res);
    });
  };
  const initialValues = useMemo(() => {
    const tmp = {};
    columnsName.forEach((column) => {
      tmp[column] = 0;
    });
    return tmp;
  });


  return (
    <>
      <div className="editPage">
        <Form
          className="editPageForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={initialValues}
          onFinish={onFinish}
          autoComplete="off"
        >
          <div>
            {columnsName.map((column, index) => (
              <Form.Item
                label={column}
                name={column}
                rules={[{ required: true }]}
              >
                {optionList && Object.keys(optionList).includes(column) ? (
                  <Select
                    style={{ width: 200 }}
                    // onChange={handleChange}
                    options={optionList?.[column]?.map((item, index) => ({
                      value: index,
                      label: item,
                    }))}
                  />
                ) : (
                  <Input style={{ width: 200 }} />
                )}
              </Form.Item>
            ))}
          </div>
          <div style={{ marginLeft: 50 }}>
            <Button type="primary" htmlType="submit">
              run model
            </Button>
            <div>{predictionTag(result?.prediction)}</div>
          </div>
        </Form>
      </div>
    </>
  );
}

export default EditPage;

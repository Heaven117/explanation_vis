import { useState } from "react";
import { Button, InputNumber, Slider } from "antd";
import { adult_process_names as columnsName } from "@/constants";
import _ from "lodash";
import { api } from "@/service/request";

function EditPage() {
  const [inputValue, setInputValue] = useState(
    new Array(columnsName.length).fill(0)
  );

  const onChange = (newValue, index) => {
    const nValue = _.cloneDeep(inputValue);
    nValue[index] = newValue;
    setInputValue(nValue);
  };

  const onClick = () => {
    console.log(inputValue);
    api("runModel", inputValue, "POST");
  };

  return (
    <>
      <div className="editPage">
        <Button type="primary" onClick={onClick}>
          run model
        </Button>
        {columnsName.map((item, index) => (
          <div className="row">
            <div className="title">{item}</div>
            <div className="slider">
              <Slider
                min={1}
                max={20}
                onChange={(n) => onChange(n, index)}
                value={
                  typeof inputValue[index] === "number" ? inputValue[index] : 0
                }
              />
            </div>
            <div>
              <InputNumber
                min={1}
                max={20}
                style={{ margin: "0 16px" }}
                value={inputValue[index]}
                onChange={(n) => onChange(n, index)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default EditPage;

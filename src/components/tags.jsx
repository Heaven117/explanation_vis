import { Tag } from "antd";
import { adult_target_value as targetName } from "@/constants";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
export const categoryTag = (category) => {
  let color = "grey";
  switch (category) {
    case "TP":
      color = "#87d068";
      break;
    case "TN":
      color = "success";
      break;
    case "FP":
      color = "#f50";
      break;
    case "FN":
      color = "error";
      break;
    default:
      color = "grey";
  }
  return (
    <Tag className="icon" color={color}>
      {category}
    </Tag>
  );
};

export const predictionTag = (prediction) => {
  return (
    <Tag color={prediction === targetName[0] ? "#cd201f" : "#2ca25f"}>
      {prediction}
    </Tag>
  );
};

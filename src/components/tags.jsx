import { Tag } from "antd";
import { adult_target_value as targetName } from "@/constants";
import _ from "lodash";
export const categoryTag = (category) => {
  if (!category) return null;
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
  if (_.isNil(prediction)) return null;
  return (
    <Tag color={prediction ? "#2ca25f" : "#cd201f"}>
      {targetName[prediction]}
    </Tag>
  );
};

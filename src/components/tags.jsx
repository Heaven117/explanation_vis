import { Tag } from "antd";
import { adult_target_value as targetName } from "@/constants";
import _ from "lodash";

export const CAT_COLOR = {
  TP: "#87d068",
  TN: "success",
  FP: "#f50",
  FN: "error",
};
export const categoryTag = (category) => {
  if (!category) return null;
  let color = "grey";
  switch (category) {
    case "TP":
      color = CAT_COLOR.TP;
      break;
    case "TN":
      color = CAT_COLOR.TN;
      break;
    case "FP":
      color = CAT_COLOR.FP;
      break;
    case "FN":
      color = CAT_COLOR.FN;
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

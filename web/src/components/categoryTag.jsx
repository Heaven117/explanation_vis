import { Tag } from "antd";

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

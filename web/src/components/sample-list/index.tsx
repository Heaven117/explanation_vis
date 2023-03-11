import { getSampleList } from "@/service";
import React, { useCallback, useMemo, useState } from "react";
import "./index.scss";

const SampleList: React.FC = () => {
  const sampleSize = 1900;

  const getItem = () => {
    let i = 0;
    let _list = new Array(0);
    console.log(_list);

    while (i < sampleSize) {
      _list.push(<div>{i}</div>);
      i++;
    }
    return _list;
  };

  return (
    <div
      className="sampleList"
      style={{ overflow: "scroll", height: 800, scrollbarWidth: "none" }}
    >
      {getItem().map((item, index) => item)}
    </div>
  );
};
export default SampleList;

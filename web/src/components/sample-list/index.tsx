import { api } from "@/service/request";
import React, { useCallback, useMemo, useState } from "react";
import "./index.scss";
import _ from "lodash";
import { useReducerContext } from "@/service/store";

const SampleList: React.FC = () => {
  const sampleSize = 1900;
  const { dispatch } = useReducerContext();

  const getInstance = useCallback(
    (index) => {
      dispatch({ type: "setCurrentId", payload: index });
    },
    [dispatch]
  );

  const getItem = () => {
    let i = 0;
    let _list = new Array(0);
    console.log(_list);

    while (i < sampleSize) {
      let j = i;
      _list.push(
        <div className="sampleList-item" onClick={() => getInstance(j)}>
          {i}
        </div>
      );
      i++;
    }
    return _list;
  };

  return (
    <div className="sampleList">{getItem().map((item, index) => item)}</div>
  );
};
export default SampleList;

import React, { createContext, useReducer, useContext } from "react";

const store = {
  rawData: undefined,
  currentId: 0,
  curSample: undefined,
  curAnchor: undefined,
  compareItem: undefined,
  featureName: undefined,
  modelInfo: undefined,
};

const reducer = (preState, action) => {
  const { type, payload } = action;
  console.log("dispatch==>", type, payload);

  switch (type) {
    default:
      return preState;
    case "setRawData":
      return {
        ...preState,
        rawData: payload,
      };
    case "setCurSample":
      return {
        ...preState,
        curSample: payload.sample,
      };
    case "setCurAnchor":
      return {
        ...preState,
        curAnchor: payload.anchor,
      };
    case "setCurrentId":
      return {
        ...preState,
        currentId: payload,
      };
    case "setCompareItem":
      return {
        ...preState,
        compareItem: payload,
      };
    case "setFeatureName":
      return {
        ...preState,
        featureName: payload,
      };
    case "setModelInfo":
      return {
        ...preState,
        modelInfo: payload,
      };
  }
};

const Context = createContext({
  state: store,
  dispatch: () => {},
});

export const ReducerContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, store);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
};

export const useReducerContext = () => {
  return useContext(Context);
};

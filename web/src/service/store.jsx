import React, { createContext, Dispatch, useReducer, useContext } from "react";

const store = {
  totalSample: 0,
  currentId: undefined,
  rawData: undefined,
  compareItem: undefined,
}  

const reducer = (
  preState,
  action
) => {
  const { type, payload } = action;
  console.log("dispatch==>", type, payload);

  switch (type) {
    default:
      return preState;
    case "setTotalSample":
      return {
        ...preState,
        totalSample: payload,
      };
    case "setRawData":
      return {
        ...preState,
        rawData: payload,
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
  }
};

// interface IContext {
//   state: IState;
//   dispatch: Dispatch<{
//     type: string;
//     payload?: any;
//   }>;
// }

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

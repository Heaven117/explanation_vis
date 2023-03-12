import React, { createContext, Dispatch, useReducer, useContext } from "react";

interface IState {
  totalSample?: number;
  currentId?: number; // 当前选中test data
  rawData?: any;
  compareItem?: any;
}

const store: any = {
  totalSample: 0,
  currentId: 0,
  rawData: undefined,
  compareItem: undefined,
};

const reducer = (
  preState: IState,
  action: {
    type: string;
    payload?: any;
  }
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

interface IContext {
  state: IState;
  dispatch: Dispatch<{
    type: string;
    payload?: any;
  }>;
}

const Context = createContext<IContext>({
  state: store,
  dispatch: () => {},
});

export const ReducerContextProvider: React.FC<any> = (props) => {
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

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { ReducerContextProvider } from "./service/store";

function Index() {
  return (
    <ReducerContextProvider>
      <App />
    </ReducerContextProvider>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Index />);

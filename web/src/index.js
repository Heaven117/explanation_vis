import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.tsx';
import { ReducerContextProvider } from "./service/store";

function Index(){
    return <ReducerContextProvider><App/></ReducerContextProvider>
}
ReactDOM.render(<Index />, document.getElementById('root'))
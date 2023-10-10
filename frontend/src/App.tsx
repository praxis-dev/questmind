import React from "react";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./store";

import Header from "./components/Header/Header";
import QueryResponse from "./pages/QueryResponse";

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Header />
        <QueryResponse />
      </div>
    </Provider>
  );
}

export default App;

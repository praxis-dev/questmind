import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";
import { store } from "./store";

import "./App.css";

import { RouteRender } from "./routes/routeRender";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "Monospace",
          fontSize: 14,
        },
      }}
    >
      <Router>
        <Provider store={store}>
          <div className="App">
            <RouteRender />
          </div>
        </Provider>
      </Router>
    </ConfigProvider>
  );
}

export default App;

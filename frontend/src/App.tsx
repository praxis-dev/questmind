import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import Switch too

import { Provider } from "react-redux";
import { store } from "./store";

import Header from "./components/Header/Header";
import QueryResponse from "./pages/QueryResponse";

import "./App.css";

function App() {
  return (
    <Router>
      <Provider store={store}>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<QueryResponse />} />
          </Routes>
        </div>
      </Provider>
    </Router>
  );
}

export default App;

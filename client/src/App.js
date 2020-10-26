import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React, { Fragment } from "react";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/landing";
import Login from "./components/auth/Login";
import Alert from "./components/layout/alert";
import Register from "./components/auth/Register";
// to combine redux with react
import { Provider } from "react-redux";
import store from "./store";
// link about react-router-dom
//https://reactrouter.com/web/guides/quick-start
const App = () => (
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          {/**not inside Switch */}
          <Alert />
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
);
export default App;

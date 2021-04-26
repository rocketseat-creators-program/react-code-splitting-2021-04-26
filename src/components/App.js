import React, { lazy, Suspense } from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
// context
import { useUserState } from "../context/UserContext";

// components
const Layout = lazy(() => import(
  /* webpackChunkName: "Layout" */
  /* webpackPrefetch: true */
  "./Layout"));

// pages
const Error = lazy(() => import(/* webpackChunkName: "Error" */"../pages/error"));
const Login = lazy(() => import(
  /* webpackChunkName: "Login" */
  /* webpackPreload: true */
"../pages/login"));


export default function App() {
  // global
  var { isAuthenticated } = useUserState();

  return (
    <HashRouter>
      <Suspense fallback={<>Loading...</>}>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/app/dashboard" />} />
          <Route
            exact
            path="/app"
            render={() => <Redirect to="/app/dashboard" />}
          />
          <PrivateRoute path="/app" component={Layout} />
          <PublicRoute path="/login" component={Login} />
          <Route component={Error} />
        </Switch>
      </Suspense>
    </HashRouter>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: "/",
              }}
            />
          ) : (
            React.createElement(component, props)
          )
        }
      />
    );
  }
}

import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/auth";

function PrivateRoute({ component: Component, ...rest }) {
  const { state, dispatch } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={props =>
        state.isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname: '/login',
            state: {
              from: props.location
            }
          }
          } />
        )
      }
    />
  );
}

export default PrivateRoute;
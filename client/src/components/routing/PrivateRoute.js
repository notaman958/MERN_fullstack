import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { loadUser } from "../../actions/auth";
//pass component
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  // any thing passed in component put in route
  // check auth, 1/ redirect if FAIL else forward
  <Route
    {...rest}
    render={(
      props // use render (Higher-Order Component) to check for auth normal Route cannt
    ) =>
      !isAuthenticated && !loading ? (
        <Redirect to="/login" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});
// no action here
export default connect(mapStateToProps)(PrivateRoute);

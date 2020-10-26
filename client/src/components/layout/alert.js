import React from "react";
import PropTypes from "prop-types";
// connect for redux and react
import { connect } from "react-redux";
// set CSS
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map((alert) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));
// create props alerts for alert
Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};
// set get state into alerts prop
const mapStateToProps = (state) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);

import React, { Fragment, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// get Redux  alert here > to use have to connect in export
import { setAlert } from "../../actions/alert";
import { connect } from "react-redux";
// layout/alert
import PropTypes from "prop-types";

// useState of Hook
const Register = ({ setAlert }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const { name, email, password, password2 } = formData;
  const onChange = (e) =>
    setFormData({
      ...formData /*copy of formData */,
      [e.target.name]:
        e.target.value /*get name atttribute + set form prop value */,
    });
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      /*Where to link with redux alert */
      setAlert("Password not match", "danger"); // in App.css dynamic change the .alert-<danger|success|..>
      //   console.log("pwd not match");
    } else {
      //   //hold all the value fields
      //   const newUser = {
      //     name,
      //     email,
      //     password,
      //   };
      //   try {
      //     // config to send data in type
      //     const config = {
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //     };
      //     const body = JSON.stringify(newUser); // change into JSON
      //     const res = await axios.post("/api/users", body, config); // have proxy
      //     console.log(res.data); // receive token here
      //   } catch (err) {
      //     console.error(err.response.data);
      //   }
    }
  };
  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      {/** Add submit*/}
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        <div className="form-group">
          {/*place name value here */}
          <input
            type="text"
            placeholder="Name"
            name="name"
            /*{name} is formData prop*/
            value={name}
            /*call function onChange */
            onChange={(e) => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            /*call function onChange */
            onChange={(e) => onChange(e)}
            required /** need it */
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            /*call function onChange */
            onChange={(e) => onChange(e)}
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            /*call function onChange */
            onChange={(e) => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/register">Sign In</Link>
      </p>
    </Fragment>
  );
};
//
Register.propTypes = { setAlert: PropTypes.func.isRequired };
// first params of connect( state,object of actions )
export default connect(null, { setAlert })(Register);

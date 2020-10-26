import React, { Fragment, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// useState of Hook
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const onChange = (e) =>
    setFormData({
      ...formData /*copy of formData */,
      [e.target.name]:
        e.target.value /*get name atttribute + set form prop value */,
    });
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("SUCCESS");
  };
  return (
    <Fragment>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign into your Account
      </p>
      {/** Add submit*/}
      <form className="form" onSubmit={(e) => onSubmit(e)}>
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

        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/login">Sign Up</Link>
      </p>
    </Fragment>
  );
};

export default Login;

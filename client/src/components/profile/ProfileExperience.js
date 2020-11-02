import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";

const ProfileExperience = ({
  experience: { company, title, from, to, current, description },
}) => {
  return (
    <Fragment>
      <div>
        <h3 className="text-dark">{company}</h3>
        <p>
          <Moment format="DD/MM/YYYY">{from}</Moment> -{" "}
          {current ? " Now" : <Moment format="DD/MM/YYYY">{to}</Moment>}
        </p>
        <p>
          <strong>Position: </strong>
          {title}
        </p>
        <p>
          <strong>Description: </strong>
          {description}
        </p>
      </div>
    </Fragment>
  );
};

ProfileExperience.propTypes = {
  experience: PropTypes.array.isRequired,
};

export default ProfileExperience;

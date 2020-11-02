import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment"; // format date
import { connect } from "react-redux";
import { deleteEdu } from "../../actions/profile";
const Education = ({ education, deleteEdu }) => {
  const eduEl = education.map((edu) => (
    <tr key={edu._id}>
      <td>{edu.school}</td>
      <td className="hide-sm">{edu.fieldofstudy}</td>
      <td className="hide-sm">{edu.degree}</td>
      <td>
        <Moment format="DD/MM/YYYY">{edu.from}</Moment> -{" "}
        {edu.to === null ? (
          "Now"
        ) : (
          <Moment format="DD/MM/YYYY">{edu.to}</Moment>
        )}
      </td>
      <td>
        <button onClick={() => deleteEdu(edu._id)} className="btn btn-danger">
          Delete
        </button>
      </td>
    </tr>
  ));
  return (
    <Fragment>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Field of Study</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th className="hide-sm">Action</th>
          </tr>
        </thead>
        <tbody>{eduEl}</tbody>
      </table>
    </Fragment>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEdu: PropTypes.func.isRequired,
};

export default connect(null, { deleteEdu })(Education);

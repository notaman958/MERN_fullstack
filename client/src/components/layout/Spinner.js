import React, { Fragment } from "react";
import Spinner from "../../img/sakamoto.gif";

export default () => (
  <Fragment>
    <section className="container">
      <img
        src={Spinner}
        style={{ width: "200px", margin: "auto", display: "block" }}
        alt="loading"
      />
      <div
        style={{
          display: "block",
          verticalAlign: "middle",
          textAlign: "center",
        }}
      >
        <h2>Relax we are loading!!!</h2>
      </div>
    </section>
  </Fragment>
);

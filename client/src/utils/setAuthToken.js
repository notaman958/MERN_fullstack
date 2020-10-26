import axios from "axios";
const setAuthToken = (token) => {
  if (token) {
    //set default header which will be sent with every request make.
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};
export default setAuthToken;

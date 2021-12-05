import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { MDBInput } from "mdbreact";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Register = ({ history }) => {
  const [email, setEmail] = useState("");
  const { user } = useSelector((state) => ({ ...state }));
  useEffect(() => {
    if (user && user.token) {
      history.push("/");
    }
  }, [history, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //  console.log("ENV --->", process.env.REACT_APP_REGISTER_REDIRECT_URL);
    const config = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };

    await auth.sendSignInLinkToEmail(email, config);
    toast.success(`Confirmation email has been sent to ${email}`);
    // save user email in local storage
    window.localStorage.setItem("emailForRegistration", email);
    // clear state
    setEmail("");
  };

  const registerForm = () => (
    <form onSubmit={handleSubmit}>
      <MDBInput
        type="email"
        className="form-control"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        // hint="Your email address"
        label="Email address"
        background
        icon="envelope"
        autoFocus
      />

      <button type="submit" className="btn btn-dark p-3 float-right">
        Register
      </button>

      <Link className="pt-5" to="/mobileregister">
        <i>Register using mobile number?</i>
      </Link>
    </form>
  );

  return (
    <>
      <div className="container p-5">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            {/* <h4>Registeration Page</h4> */}
            <br />

            {registerForm()}
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default Register;

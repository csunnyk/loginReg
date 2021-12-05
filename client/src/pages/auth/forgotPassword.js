import { MDBInput } from "mdbreact";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const ForgotPassword = ({ history }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT,
      handleCodeInApp: true,
    };

    await auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        setEmail("");
        setLoading(false);
        toast.success("Check your email to reset your password");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  };

  useEffect(() => {
    if (user && user.token) {
      history.push("/");
    }
  }, [history, user]);
  return (
    <div className="container col-md-6 offset-md-3 p-5">
      {loading ? (
        <div className="spinner-grow text-primary text-center" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <h4>Forgot Password</h4>
      )}
      <form onSubmit={handleSubmit}>
        <MDBInput
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email address"
          icon="envelope"
          background
          autoFocus
        />
        <br />
        <button className="btn btn-primary float-right" disabled={!email}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;

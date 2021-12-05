import React, { useState, useEffect } from "react";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { MDBInput } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateUser } from "../../functions/auth";
import Register from "./Register";

const RegisterComplete = ({ history }) => {
  const { user } = useSelector((state) => ({ ...state }));

  let dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user && user.token) {
      history.push("/");
    }
    setEmail(window.localStorage.getItem("emailForRegistration"));
  }, [history, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and Password are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be atleast 6 character long");
      return;
    }

    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      if (result.user.emailVerified) {
        // remove user from localStorage
        window.localStorage.removeItem("emailForRegistration");
        // get user Id token
        let user = auth.currentUser;
        await user.updatePassword(password);
        const idTokenResult = await user.getIdTokenResult();
        // redux store
        createOrUpdateUser(idTokenResult.token)
          .then((res) =>
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                role: res.data.role,
                _id: res.data._id,
                token: idTokenResult.token,
              },
            })
          )
          .catch((error) => console.log(error));
        // redirect
        history.push("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const completeRegistrationForm = () => (
    <form onSubmit={handleSubmit}>
      <MDBInput
        type="email"
        className="form-control"
        value={email}
        icon="envelope"
        background
        disabled
      />

      <MDBInput
        type="password"
        className="form-control"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Enter password"
        icon="key"
        background
        autoFocus
      />
      <br />
      <button type="submit" className="btn btn-success m-1">
        Complete Registration
      </button>
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h4>Register Complete</h4>
          {completeRegistrationForm()}
        </div>
      </div>
    </div>
  );
};

export default RegisterComplete;

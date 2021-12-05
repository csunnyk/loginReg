import { MDBInput } from "mdbreact";
import React, { useEffect, useState } from "react";
import { auth, googleAuthProvider } from "../../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrUpdateUser } from "../../functions/auth";

const Login = ({ history }) => {
  const [email, setEmail] = useState("csunnykchoudhary1@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }));

  let dispatch = useDispatch();
  useEffect(() => {
    let intended = history.location.state;
    if (intended) {
      return;
    } else {
      if (user && user.token) history.push("/");
    }
  }, [user, history]);

  const roleBasedRedirect = (res) => {
    // check if intended
    let intended = history.location.state;
    if (intended) {
      history.push(intended.from);
    } else {
      if (res.data.role === "admin") {
        history.push("/details");
      } else {
        history.push("/register");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.table(email, password);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      // console.log(result);
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      createOrUpdateUser(idTokenResult.token)
        .then((res) => {
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              name: res.data.name,
              email: res.data.email,
              role: res.data.role,
              _id: res.data._id,
              token: idTokenResult.token,
            },
          });
          roleBasedRedirect(res);
        })
        .catch((error) => console.log(error));

      history.push("/details");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then(async (result) => {
        const { user } = result;
        const idTokenResult = await user.getIdTokenResult();
        createOrUpdateUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              },
            });
            roleBasedRedirect(res);
          })
          .catch();
        history.push("/details");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.message);
      });
  };

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
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
      </div>

      <div className="form-group">
        <MDBInput
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="password"
          icon="key"
          background
        />
      </div>

      <br />

      <button
        type="submit"
        class="btn btn-dark btn-md btn-block"
        onClick={handleSubmit}
        disabled={!email || password.length < 6}
      >
        login
      </button>

      <br />
    </form>
  );

  return (
    <div className="container p-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          {loading ? (
            <div
              className="spinner-grow  text-primary text-center"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <h4>Login</h4>
          )}
          {/* <hr /> */}
          <br />
          {loginForm()}

          <Button
            onClick={googleLogin}
            type="danger"
            className="mb-1"
            block
            size="large"
          >
            <i className="fab fa-google"> Login with Google</i>
          </Button>
          <br />
          <Link to="/register">
            <b>
              <i>Register?</i>
            </b>
          </Link>
          <hr />

          {/* <h6 className="float-left m-1">Don't have an account?</h6>
          <Link to="/register" className="float-left m-1">
            Sign Up
          </Link> */}
          <Link to="/forgot/password" className="float-right text-primary">
            <i class="fas fa-lock"> Forgot password?</i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

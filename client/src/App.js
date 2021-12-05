import React, { useEffect, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { currentUser } from "./functions/auth";
import { LoadingOutlined } from "@ant-design/icons";

import { auth } from "./firebase";
import Details from "./pages/Details";
import MobileRegister from "./pages/auth/MobileRegister";

const Login = lazy(() => import("./pages/auth/Login"));

const Register = lazy(() => import("./pages/auth/Register"));
const RegisterComplete = lazy(() => import("./pages/auth/RegisterComplete"));

const ForgotPassword = lazy(() => import("./pages/auth/forgotPassword"));

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        // console.log("user",user);
        currentUser(idTokenResult.token)
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
      }
    });
    return () => unsubscribe();
  }, [dispatch]);
  return (
    <Suspense
      fallback={
        <div className="col text-center p-5" style={{ fontFamily: "" }}>
          L
          <LoadingOutlined style={{ color: "#0cbaba" }} />
          ading
        </div>
      }
    >
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <Route exact path="/register" component={Register}></Route>
        <Route exact path="/mobileregister" component={MobileRegister}></Route>
        <Route exact path="/details" component={Details}></Route>
        <Route
          exact
          path="/register/complete"
          component={RegisterComplete}
        ></Route>
        <Route exact path="/forgot/password" component={ForgotPassword}></Route>
      </Switch>
    </Suspense>
  );
};

export default App;

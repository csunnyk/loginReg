import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const MobileRegister = ({ history }) => {
  const dispatch = useDispatch();
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");

  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "sign-in-button",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          onSignInSubmit();
          console.log("Recaptca varified");
        },
        defaultCountry: "IN",
      }
    );
  };
  const onSignInSubmit = (e) => {
    e.preventDefault();
    configureCaptcha();
    const phoneNumber = "+91" + number;
    console.log(phoneNumber);
    const appVerifier = window.recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        toast.success("OTP has been sent");
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
        toast.error("SMS not sent");
      });
  };
  const onSubmitOTP = (e) => {
    e.preventDefault();
    const code = otp;
    console.log(code);
    window.confirmationResult
      .confirm(code)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log(user.phoneNumber);
        console.log(JSON.stringify(user));
        alert(
          `User is verified with number ${user.phoneNumber} and id ${user.uid}`
        );
        history.push("/");
        // ...
      })
      .catch((error) => {
        // User couldn't sign in (bad verification code?)
        // ...
      });
  };

  return (
    <div className=" container text-center">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <h2 className="mt-3">Phone Number</h2>
          <form onSubmit={onSignInSubmit}>
            <div id="sign-in-button"></div>
            <input
              className="form-control"
              type="number"
              name="mobile"
              placeholder="Mobile number"
              required
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <button
              className="form-control btn btn-dark p-2 mt-3"
              type="submit"
            >
              Submit
            </button>
          </form>

          <h2 className="mt-3">Enter OTP</h2>
          <form onSubmit={onSubmitOTP}>
            <input
              className="form-control"
              type="number"
              name="otp"
              value={otp}
              placeholder="OTP Number"
              required
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="btn btn-dark form-control p-2 mt-3"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MobileRegister;

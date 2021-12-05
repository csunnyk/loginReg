import React from "react";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";

const Details = ({ history }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));
  const usrdetails = () => {
    return (
      <div className="text-center">
        <h6>
          <b>Name: </b>
          {user.name}
        </h6>
        <h6>
          <b>Email: </b>
          {user.email}
        </h6>
      </div>
    );
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch({ type: "LOGOUT", payload: null });
    history.push("/");
  };
  return (
    <div className="text-center">
      <h4 className="text-center pt-2">User Details</h4>
      {user ? usrdetails() : <h6>No details found</h6>}

      <button className="btn btn-dark text-center" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Details;

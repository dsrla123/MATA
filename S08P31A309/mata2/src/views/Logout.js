import React, {useEffect} from 'react';
import backgroundImage from '../assets/Welcome.jpg'
import './Welcome.css'
import {Navigate} from "react-router-dom";
const Logout = (props) => {
  useEffect(() => {
    sessionStorage.removeItem("accessToken");
    props.state.setUser({});
  }, []);
  return (
    <>
      <Navigate to="/"></Navigate>
    </>
  );
};

export default Logout;
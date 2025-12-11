// TopupWrapper.jsx
import React from "react";
import { ReactLenis } from "lenis/react";
import Topup from "./Topup";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const TopupWrapper = () => {
  return (
    <ReactLenis root options={{ smooth: true }}>
      <Topup />
      <ToastContainer position="top-center" autoClose={2000} />
    </ReactLenis>
  );
};

export default TopupWrapper;

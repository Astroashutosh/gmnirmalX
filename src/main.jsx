// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { Provider } from "react-redux";
// import { store } from "./redux/store";
// import './assets/css/animate.css'
// import './assets/css/flaticon.css'
// import './assets/css/tiny-slider.css'
// import './assets/css/glightbox.min.css'
// import './assets/css/aos.css'
// import './assets/css/style.css'
// import './assets/style.css'

// import './index.css'
// // import './assets/user/css/all.min.css'
// import './assets/user/css/bootstrap.min.css'

// import './assets/user/css/doogle.css'
// import './assets/user/css/magnific-popup.css'
// import './assets/user/css/modal_popupe209e209.css?v=1.0.0'
// import './assets/user/css/stylee209e209.css?v=1.0.0'
// import './assets/user/css/mye209e209.css?v=1.0.0'


// import App from './App.jsx'
// import { BrowserRouter } from "react-router-dom";
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//         <Provider store={store}>
//       <BrowserRouter>
//           <App />
//         </BrowserRouter>
//         </Provider>
//   </StrictMode>,
// )










import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.jsx";

/* ---------- Global CSS ---------- */
import "./assets/css/animate.css";
import "./assets/css/flaticon.css";
import "./assets/css/tiny-slider.css";
import "./assets/css/glightbox.min.css";
import "./assets/css/aos.css";
import "./assets/css/style.css";
import "./assets/style.css";

import "./assets/user/css/bootstrap.min.css";
import "./assets/user/css/doogle.css";
import "./assets/user/css/magnific-popup.css";
import "./assets/user/css/modal_popupe209e209.css?v=1.0.0";
import "./assets/user/css/stylee209e209.css?v=1.0.0";
import "./assets/user/css/mye209e209.css?v=1.0.0";

import "./index.css";

/* ---------- Render ---------- */
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
      />
    </BrowserRouter>
  </Provider>
);

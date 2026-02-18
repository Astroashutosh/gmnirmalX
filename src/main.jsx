import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/animate.css'
import './assets/css/flaticon.css'
import './assets/css/tiny-slider.css'
import './assets/css/glightbox.min.css'
import './assets/css/aos.css'
import './assets/css/style.css'
import './assets/style.css'

import './index.css'
// import './assets/user/css/all.min.css'
import './assets/user/css/bootstrap.min.css'

import './assets/user/css/doogle.css'
import './assets/user/css/magnific-popup.css'
import './assets/user/css/modal_popupe209e209.css?v=1.0.0'
import './assets/user/css/stylee209e209.css?v=1.0.0'
import './assets/user/css/mye209e209.css?v=1.0.0'


import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <App />
        </BrowserRouter>
  </StrictMode>,
)

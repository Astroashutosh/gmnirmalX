import React from 'react'
import { Link } from 'react-router-dom'
function Navbar() {
  return (
    <>
    
       <nav className="navbar navbg navbar-expand-lg "  style={{
    position: "sticky",
    top: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    padding: "0 10px",
  }}>
        <div className="container-xl">
         
            <Link className="navbar-brand d-flex align-items-center" to="#">
              <img src="front/images/logo.png" style={{width: "48px",borderRadius: "40px"}}/>
             <span className="" style={{fontSize:"20px" , color:"black"}}>
             NirmalX </span>
         </Link>

         <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="fa fa-bars"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="navbarDesign nav-link navcolor " to="/">Home </Link></li>
              <li className="nav-item"><Link className="navbarDesign nav-link navcolor " to="/login">Sign In </Link></li>
              <li className="nav-item"><Link className="navbarDesign nav-link navcolor " to="#">Staking </Link></li>
              <li className="nav-item"><Link className="navbarDesign nav-link navcolor " to="#">Governance </Link></li>
              <li className="nav-item"><Link className="navbarDesign nav-link navcolor " to="front/files/NirmalXPresentation.pdf" download="NirmalX_Whitepaper.html">Whitepaper </Link></li>
              <li className="nav-item"><Link className="navbarDesign nav-link navcolor " to="#">Community </Link></li>
          </ul>
 
      </div>
  </div>
</nav>
    
    </>
  )
}

export default Navbar
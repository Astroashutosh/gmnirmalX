import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
 
    <>
      
    <div className="header-middle">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="token-title newFont">
                        <h2 className="gradient-text">NirmalX</h2>
                        <h5>Efforts are our rewards are yours!</h5>
                        <div className="row justify-content-center">
                            <div className="col-xl-8 col-md-8 col-sm-6 ">
                                <div className="row justify-content-center">
                                    <div className="col-xl-6 col-md-6 col-sm-12 mb-2">
                                        <span className="connect_btn d-inline-block" >
                                            Connected Wallet:<br/> <span  id="connected_wallet">Loading..</span>
                                        </span>
                                    </div>
                                </div>
                                
                            </div>
                          <div className="col-xl-12 col-md-12 col-sm-6">
    <div className="row d-flex flex-wrap justify-content-center">
        
        <div className="col-xl-auto col-md-6 col-sm-12 mb-2">
            <span className="connect_btn d-inline-block" id="status">
                Account Status: <span style={{ color: "red" }}>Inactive</span>
            </span>
        </div>

        <div className="col-xl-auto col-md-6 col-sm-12 mb-2">
            <Link to="/level" className="connect_btn d-inline-block">
                All Level <i className="fas fa-users"></i>
            </Link>
        </div>

        <div className="col-xl-auto col-md-6 col-sm-12 mb-2">
            <Link to="/transaction" className="connect_btn d-inline-block">
                All Transaction <i className="fas fa-list"></i>
            </Link>
        </div>

        <div className="col-xl-auto col-md-6 col-sm-12 mb-2">
            <Link to="/roiCalculator" className="connect_btn d-inline-block">
                Staking Calculator <i className="fas fa-list"></i>
            </Link>
        </div>

        <div className="col-xl-auto col-md-6 col-sm-12 mb-2">
            <Link to="https://nirmalx.io/postdata.php?logout=1" className="connect_btn d-inline-block">
                LOGOUT <i className="fas fa-sign-out-alt"></i>
            </Link>
        </div>

    </div>
</div>


                        </div>
                        
                     <br/>
                     <br/>
                        
                      
                    </div>
                </div>
            </div>
        </div>
    </div>

    
    </>

  )
}

export default Header

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import logo from '/images/logo.png';
import { useLocation } from "react-router-dom";
import {
    getMainContract,
    getUSDTContract
} from "../utils/contract";

function Staking() {
    const navigate = useNavigate();

    const { address, contracts,baseUrl } = useSelector((state) => state.wallet);
    const location = useLocation();
    const [stakeAmount, setStakeAmount] = useState("");
    //   const [withdrawAmount, setWithdrawAmount] = useState("");
    const [nrxPrice, setNrxPrice] = useState(1);
    const [userData, setUserData] = useState(null);
    const [wdId, setWdId] = useState(null);
    // useEffect(() => {
    //   if (location.state?.amount) {
    //     setStakeAmount(location.state.amount);
    //   }
    // }, [location.state]);


    useEffect(() => {

        if (location.state?.amount) {
            setStakeAmount(location.state.amount);
        }

        if (location.state?.wd_id) {
            setWdId(location.state.wd_id);
        }

    }, [location.state]);


    useEffect(() => {
        if (address) {
            loadData();
        }
    }, [address]);

    /* ================= LOAD DATA (Same PHP getAccount) ================= */

    const loadData = async () => {
        try {

            const main = await getMainContract(contracts.MAIN_CONTRACT);

            const user = await main.users(address);
            const userDetails = await main.user_details(address);

            const price = await main.getTokenToUSDT(
                ethers.parseUnits("1", 18)
            );

            const nrx_value = Number(ethers.formatUnits(price, 18));
            setNrxPrice(nrx_value);

            setUserData({
                currentStake: Number(ethers.formatUnits(user.totalCurrentStaked, 18)),
                totalROI: Number(ethers.formatUnits(user.totalROI, 18)),
                totalCapitalReturn: Number(ethers.formatUnits(userDetails.totalCapitalReturn, 18)),
                withdrawable: Number(ethers.formatUnits(user.balance, 18)),
            });

        } catch (err) {
            console.log(err);
            toast.error("Wallet not connected");
        }
    };

    /* ================= STAKE (Same PHP stakenow) ================= */

    const handleStake = async () => {
        try {

            if (!stakeAmount) {
                toast.error("Please enter amount.");
                return;
            }

            const main = await getMainContract(contracts.MAIN_CONTRACT);
            const usdt = await getUSDTContract(contracts.USDT_CONTRACT);

            const min = Number(
                ethers.formatUnits(
                    await main.minimumInvestment(), 18
                )
            );
            // alert(min);
            if (stakeAmount < min) {
                toast.error(`Minimum stake amount should be $ ${min}.`);
                return;
            }

            const confirmBox = window.confirm(
                `You are staking $ ${stakeAmount}. Press Ok to continue!`
            );

            if (!confirmBox) return;
            // alert(stakeAmount);

            const amount = ethers.parseUnits(stakeAmount.toString(), 18);
            // alert(amount);
            await (await usdt.approve(
                contracts.MAIN_CONTRACT,
                amount
            )).wait();

            await (await main.stakeTokens(amount, 1)).wait();

            await updateWithdrawStatus();
            toast.success(`Successfully staked $ ${stakeAmount}`);
            navigate('/dashboard');

            setStakeAmount("");
            loadData();

        } catch (err) {
            console.log(err);
            toast.error("Transaction failed or was rejected.");
        }
    };


    const updateWithdrawStatus = async () => {
        // console.log("withdraw id:", wdId);

        if (!wdId) return;

        try {

            const formData = new FormData();
            formData.append("action", "update_withdraw_status");
            formData.append("withdraw_id", wdId);

            const res = await fetch(
                `${baseUrl}user/user_action.php`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await res.json();

            console.log("Withdraw update:", data);

        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>

            <div className="row mt-5" >
                <div className="col-lg-4"></div>

                <div className="col-lg-4 col-md-6">
                    <div className="farms-single-section gradient-border stakeBg">
                        <div className="coin-desc">
                            <div className="coin-desc-left">
                                <img src={logo} alt="NirmalX" />
                            </div>
                            <div className="coin-desc-right newFont">
                                <h4><b>Stake Now</b></h4>
                                <ul>
                                    <li className="bg history0 nonSelect" style={{ float: "right" }}>
                                        <Link to="/stakingHistory" style={{ color: "#ffffff" }}>View History</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="calculat">
                            <div className="calculat-left">
                               <h6>Minimum :</h6>
             {/*     <h6>Maximum :</h6>
                                <h6>Current Stake :</h6> */}
                            </div>
                            <div className="calculat-right">
                                 <h6>$ 10</h6>
               {/* <h6>Unlimted</h6> 
                                <h6 className="currentStake">
                                    {userData
                                        ? `$ ${userData.currentStake.toFixed(4)} ( NRX ${(userData.currentStake / nrxPrice).toFixed(4)} )`
                                        : "Loading.."}
                                </h6>*/}
                            </div>
                        </div>

                        <label style={{ marginTop: "1.5rem" }}>Select Package*</label>
                        <select className="form-control">
                            <option value="1">Staking Package</option>
                        </select>

                        <label style={{ marginTop: "1.5rem" }}>Amount*</label>
                        <input
                            type="text"
                            placeholder="Enter amount"
                            className="form-control"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                        />

                        <div className="unlocks mt-5">
                            <a className="connect_btn unlockWallet" onClick={handleStake}>
                                Submit
                            </a>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4"></div>

            </div>

        </>
    )
}

export default Staking
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { getMainContract, getUSDTContract, getTokenContract } from "../utils/contract";
import logo from "/images/logo.png";

function OwnerWithdraw() {

  const { address, contracts } = useSelector((state) => state.wallet);

  const [owner, setOwner] = useState(null);
  const [usdtBalance, setUsdtBalance] = useState("Loading..");
  const [nrxBalance, setNrxBalance] = useState("Loading..");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [tokenType, setTokenType] = useState("1");

  const safeFormat = (val) => {
    try {
      return Number(ethers.formatUnits(val, 18));
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    if (address && contracts?.MAIN_CONTRACT) {
      loadOwnerData();
    }
  }, [address, contracts]);

  const loadOwnerData = async () => {
    try {

      const main = await getMainContract(contracts.MAIN_CONTRACT);
      const usdt = await getUSDTContract(contracts.USDT_CONTRACT);
      const token = await getTokenContract(contracts.TOKEN_CONTRACT);

      const contractOwner = await main.owner();
      setOwner(contractOwner.toLowerCase());

      if (address.toLowerCase() !== contractOwner.toLowerCase()) {
        toast.error("Only contract owner allowed.");
        return;
      }

      const usdtBal = await usdt.balanceOf(contracts.MAIN_CONTRACT);
      const nrxBal = await token.balanceOf(contracts.MAIN_CONTRACT);

      setUsdtBalance("$ " + safeFormat(usdtBal).toFixed(4));
      setNrxBalance("NRX " + safeFormat(nrxBal).toFixed(4));

    } catch (err) {
      console.error(err);
      toast.error("Failed to load contract balances");
    }
  };

  const handleWithdraw = async () => {
    try {

      if (!withdrawAmount || Number(withdrawAmount) <= 0) {
        toast.error("Invalid amount.");
        return;
      }

      if (!owner || address.toLowerCase() !== owner) {
        toast.error("Only contract owner allowed.");
        return;
      }

      const main = await getMainContract(contracts.MAIN_CONTRACT);

      const withdrawTokenAddress =
        tokenType === "1"
          ? contracts.USDT_CONTRACT
          : contracts.TOKEN_CONTRACT;

      const finalToAddress = toAddress || owner;

      const tokenName = tokenType === "1" ? "USDT" : "NRX";

      if (!window.confirm(`Are you sure want to withdraw ${withdrawAmount} ${tokenName}? Press Ok to continue!`))
        return;

      const amountWei = ethers.parseUnits(withdrawAmount, 18);

      const tx = await main.OwnerWithdraw(
        withdrawTokenAddress,
        finalToAddress,
        amountWei
      );

      await tx.wait();

      toast.success(`${tokenName} Withdrawal successful`);

      setWithdrawAmount("");
      setToAddress("");

      loadOwnerData();

    } catch (error) {
      console.error(error);
      toast.error("Blockchain transaction failed.");
    }
  };

  return (
    <>
    <div class="header-middle">
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="token-title newFont">
                    <h2 class="gradient-text">NRX Relationship Package</h2>
                </div>
            </div>
        </div>
    </div>
</div>

    <div className="markets-capital pt20 pb40">
      <div className="container">
        <div className="row justify-content-center" style={{ marginTop: "45px" }}>
          <div className="col-lg-6 col-md-6">
            <div className="farms-single-section gradient-border stakeBg">

              <div className="coin-desc">
                <div className="coin-desc-left">
                  <img src={logo} alt="Owner Withdraw" />
                </div>
                <div className="coin-desc-right newFont">
                  <h4><b>Owner Withdraw</b></h4>
                </div>
              </div>

              <div className="calculat">
                <div className="calculat-left">
                  <h6>Contract Balance (USDT):</h6>
                  <h6>Contract Balance (NRX):</h6>
                </div>
                <div className="calculat-right">
                  <h6 className="contract_balance_usdt">{usdtBalance}</h6>
                  <h6 className="contract_balance_nrx">{nrxBalance}</h6>
                </div>
              </div>

              <label style={{ marginTop: "0.5rem" }}>Select Token*</label>
              <select
                className="form-control"
                value={tokenType}
                onChange={(e) => setTokenType(e.target.value)}
              >
                <option value="1">USDT</option>
                <option value="2">NRX</option>
              </select>

              <label style={{ marginTop: "0.5rem" }}>To Address</label>
              <input
                type="text"
                placeholder="Enter To Address"
                className="form-control"
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
              />

              <label style={{ marginTop: "0.5rem" }}>Amount*</label>
              <input
                type="text"
                placeholder="Enter amount"
                className="form-control"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />

              <div className="unlocks mt-4">
                <a
                  className="connect_btn unlockWallet"
                  onClick={handleWithdraw}
                  style={{ textAlign: "center" }}
                >
                  Withdraw
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default OwnerWithdraw;